import * as ts from "typescript";
import * as os from "os";
import * as path from "path";
import * as fs from "fs-extra";
import { LogLevel, LoggerBuilder, LoggerConfigurationBuilder } from "simplr-logger";

import { ExtractorDto } from "./contracts/extractor";
import { AstSourceFile } from "./ast/declarations/ast-source-file";
import { AstRegistry, ReadonlyAstRegistry } from "./ast-registry";
import { AstDeclarations } from "./ast/ast-declarations";
import { AstTypes } from "./ast/ast-types";
import { TsHelpers } from "./ts-helpers";
import { AstTypeBasic } from "./ast/types/ast-type-basic";
import { AstDeclarationNotSupported } from "./ast/declarations/ast-declaration-not-supported";
import { AstItemOptions, AstItemGatherMembersOptions } from "./contracts/ast-item";
import { ExtractorHelpers } from "./extractor-helpers";

export interface TsExtractorConfig {
    projectDirectory: string;
    compilerOptions: ts.CompilerOptions;
    logLevel?: LogLevel;
}

export interface ExtractionResult {
    files: AstSourceFile[];
    registry: ReadonlyAstRegistry;
}

// TODO: Normalize paths.
export class TsExtractor {
    constructor(protected readonly config: TsExtractorConfig) {
        // Logging
        const loggerConfiguration = new LoggerConfigurationBuilder()
            .SetDefaultLogLevel(this.config.logLevel || LogLevel.Information)
            .Build();
        this.logger = new LoggerBuilder(loggerConfiguration);
    }

    protected logger: LoggerBuilder;

    /**
     * This runs a full type analysis, and augments the Abstract Syntax Tree (i.e. declarations)
     * with semantic information (i.e. symbols). The "diagnostics" are a subset of everyday
     * compile errors that would result from a full compilation.
     * @throws When TypeScript project has errors.
     */
    private checkTsErrors(program: ts.Program): void {
        const diagnostics = program.getSemanticDiagnostics();
        if (diagnostics.length === 0) {
            return;
        }

        const str = ts.formatDiagnosticsWithColorAndContext(program.getSemanticDiagnostics(), {
            getCanonicalFileName: () => __filename,
            getCurrentDirectory: () => this.config.projectDirectory,
            getNewLine: () => os.EOL
        });
        this.logger.Error(str);
        throw new Error("TypeScript compilation errors. Please fix them before using extractor.");
    }

    /**
     * Checks and resolves absolute path of given files.
     * @throws When file does not exists or files are not in project directory.
     */
    private resolveFilesLocation(files: string[]): string[] {
        const resolvedFilesLocation = files.map(file => {
            if (path.isAbsolute(file)) {
                return file;
            }

            return path.join(this.config.projectDirectory, file);
        });

        // Check whether files exist and are in project directory.
        resolvedFilesLocation.forEach(filePath => {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Given file "${filePath}", does not exist.`);
            }

            if (fs.realpathSync(filePath).indexOf(this.config.projectDirectory) === -1) {
                throw new Error(`Given file "${filePath}", is not in project directory "${this.config.projectDirectory}".`);
            }
        });

        return resolvedFilesLocation;
    }

    public extract(files: string[]): ExtractionResult {
        const rootNames = this.resolveFilesLocation(files);
        const program = ts.createProgram(rootNames, this.config.compilerOptions);
        const registry = new AstRegistry({ logger: this.logger });

        this.checkTsErrors(program);

        const options: AstItemOptions = {
            program: program,
            projectDirectory: this.config.projectDirectory,
            itemsRegistry: registry,
            logger: this.logger,
            resolveAstDeclaration: (declaration, symbol, identifiers) => {
                if (registry.hasItem(declaration)) {
                    return registry.getAstItemById(registry.getIdByItem(declaration)!)!;
                }

                const $constructor = AstDeclarations.get(declaration.kind);
                if ($constructor == null) {
                    ExtractorHelpers.logWithNodePosition(
                        declaration,
                        `Unsupported declaration kind "${ts.SyntaxKind[declaration.kind]}".`,
                        x => this.logger.Warn(x)
                    );
                    return new AstDeclarationNotSupported(options, declaration, symbol, identifiers);
                }

                // TODO: Fix any.
                return new $constructor(options, declaration, symbol, identifiers) as any;
            },
            resolveAstType: (type, typeNode, identifiers) => {
                if (typeNode == null) {
                    typeNode = program.getTypeChecker().typeToTypeNode(type);
                }

                const $constructor = AstTypes.get(typeNode.kind);
                if ($constructor == null) {
                    return new AstTypeBasic(options, type, typeNode, identifiers);
                }

                return new $constructor(options, type, typeNode, identifiers);
            }
        };

        // After adding item to registry we gather members.
        // This way prevents infinite loops.
        const gatheringOptions: AstItemGatherMembersOptions = {
            addAstItemToRegistry: item => {
                this.logger.Debug(`Extractor [${item.id}] Adding ${item.itemKind} to registry.`);
                registry.addItem(item);
                item.gatherMembers(gatheringOptions);
            },
            addAstSymbolToRegistry: symbol => {
                registry.addSymbol(symbol);
                symbol.gatherMembers(gatheringOptions);
            }
        };

        // Go through all given files.
        const sourceFiles: AstSourceFile[] = [];
        program.getRootFileNames().forEach(fileName => {
            const sourceFile: ts.SourceFile | undefined = program.getSourceFile(fileName);
            if (sourceFile == null) {
                return;
            }
            const symbolSourceFile = TsHelpers.getSymbolFromDeclaration(sourceFile, program.getTypeChecker());
            if (symbolSourceFile == null) {
                return;
            }

            const astSourceFile = new AstSourceFile(options, sourceFile, symbolSourceFile, { packageName: "@simplrjs/package-name" });
            gatheringOptions.addAstItemToRegistry(astSourceFile);
            sourceFiles.push(astSourceFile);
        });

        return {
            files: sourceFiles,
            registry: registry
        };
    }

    public extractToJson(files: string[]): ExtractorDto {
        const extractionResult = this.extract(files);
        const filesIds = extractionResult.files.map<string>(x => x.id);
        // TODO: Fix any.
        const registry: { [key: string]: any } = {};

        for (const [itemId, astItem] of extractionResult.registry) {
            registry[itemId] = astItem.extract();
        }

        return {
            name: "package_name",
            version: "_0.0.0",
            registry: registry,
            files: filesIds
        };
    }
}
