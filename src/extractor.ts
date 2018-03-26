import * as ts from "typescript";
import * as os from "os";
import * as path from "path";
import * as fs from "fs-extra";
import { LogLevel, LoggerBuilder, LoggerConfigurationBuilder } from "simplr-logger";

import { ExtractorDto } from "./contracts/extractor";
import { AstSourceFile } from "./ast/ast-source-file";
import { AddItemToRegistryHandler, AstItemBase, ResolveDeclarationHandler, ResolveTypeHandler } from "./abstractions/ast-item-base";
import { AstDeclarations } from "./ast-declarations";
import { AstTypes } from "./ast-types";
import { AstTypeDefault } from "./ast/ast-type-default";

export interface TsExtractorConfig {
    projectDirectory: string;
    compilerOptions: ts.CompilerOptions;
    logLevel?: LogLevel;
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

    public extract(files: string[]): AstSourceFile[] {
        const rootNames = this.resolveFilesLocation(files);
        const program = ts.createProgram(rootNames, this.config.compilerOptions);
        const registry = new Map<string, AstItemBase<any, any>>();

        this.checkTsErrors(program);

        const addItemHandler: AddItemToRegistryHandler = item => {
            registry.set(item.itemId, item);
            // After adding item to registry we gather members.
            item.gatherMembers();
        };

        const resolveDeclaration: ResolveDeclarationHandler = (options, declaration) => {
            const $constructor = AstDeclarations.get(declaration.kind);
            if ($constructor == null) {
                this.logger.Warn(`Unsupported declaration kind "${ts.SyntaxKind[declaration.kind]}".`);
                return undefined;
            }

            return new $constructor(options, declaration);
        };

        const resolveType: ResolveTypeHandler = (options, type, typeNode) => {
            if (typeNode == null) {
                typeNode = program.getTypeChecker().typeToTypeNode(type);
            }

            let $constructor = AstTypes.get(typeNode.kind);
            if ($constructor == null) {
                $constructor = AstTypeDefault;
            }

            return new $constructor(options, type, typeNode);
        };

        // Go through all given files.
        const sourceFiles: AstSourceFile[] = [];
        program.getRootFileNames().forEach(fileName => {
            const sourceFile: ts.SourceFile | undefined = program.getSourceFile(fileName);
            if (sourceFile == null) {
                return;
            }

            const astSourceFile = new AstSourceFile(
                {
                    program: program,
                    parentId: "@simplrjs/package-name",
                    projectDirectory: this.config.projectDirectory,
                    addItemToRegistry: addItemHandler,
                    itemsRegistry: registry,
                    logger: this.logger,
                    resolveDeclaration: resolveDeclaration,
                    resolveType: resolveType
                },
                sourceFile
            );

            addItemHandler(astSourceFile);
            sourceFiles.push(astSourceFile);
        });

        return sourceFiles;
    }

    public extractToJson(files: string[]): ExtractorDto {
        return {
            name: "package_name",
            version: "_0.0.0",
            registry: {},
            files: []
        };
    }
}
