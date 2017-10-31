import * as ts from "typescript";
import * as os from "os";
import * as fs from "fs-extra";
import { PackageJson } from "read-package-json";
import * as path from "path";

import { Logger, LogLevel } from "./utils/logger";
import { ApiSourceFile } from "./definitions/api-source-file";
import { ApiItemsRegistry } from "./api-items-registry";
import { RegistryDict } from "./contracts/items-registry";
import { ApiItem } from "./abstractions/api-item";
import { ApiSourceFileDto } from "./contracts/definitions/api-source-file-dto";
import { ApiBaseItemDto } from "./contracts/api-base-item-dto";

export type RegistryExtractedItems = { [key: string]: ApiBaseItemDto };

export interface ExtractDto {
    Registry: RegistryExtractedItems;
    EntryFiles: ApiSourceFileDto[];
}

export interface ExtractorOptions {
    CompilerOptions: ts.CompilerOptions;
    ProjectDirectory: string;
}

export class Extractor {
    constructor(options: ExtractorOptions) {
        this.compilerOptions = options.CompilerOptions;
        this.projectDirectory = fs.realpathSync(options.ProjectDirectory);
    }

    private compilerOptions: ts.CompilerOptions;
    private projectDirectory: string;

    public Extract(files: string[]): ExtractDto {
        const rootNames = files.map(file => {
            if (path.isAbsolute(file)) {
                return file;
            }

            return path.join(this.projectDirectory, file);
        });

        // Check if files exist and they are in project directory.
        rootNames.forEach(filePath => {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Given file: ${filePath}, does not exist.`);
            }

            if (fs.realpathSync(filePath).indexOf(this.projectDirectory) === -1) {
                throw new Error(`Given file "${filePath}", is not in project directory "${this.projectDirectory}".`);
            }
        });

        const program = ts.createProgram(rootNames, this.compilerOptions);
        const itemsRegistry = new ApiItemsRegistry();

        // This runs a full type analysis, and then augments the Abstract Syntax Tree (i.e. declarations)
        // with semantic information (i.e. symbols).  The "diagnostics" are a subset of the everyday
        // compile errors that would result from a full compilation.
        const diagnostics = program.getSemanticDiagnostics();
        if (diagnostics.length > 0) {
            const str = ts.formatDiagnosticsWithColorAndContext(program.getSemanticDiagnostics(), {
                getCanonicalFileName: () => __filename,
                getCurrentDirectory: () => this.projectDirectory,
                getNewLine: () => os.EOL
            });
            Logger.Log(LogLevel.Error, str);
            throw new Error("TypeScript compilation errors. Please fix them before using extractor.");
        }

        const typeChecker = program.getTypeChecker();
        const apiSourceFiles: ApiSourceFile[] = [];

        // Go through all given files.
        const rootFiles = program.getRootFileNames();
        rootFiles.forEach(fileName => {
            const sourceFile: ts.SourceFile = program.getSourceFile(fileName);
            const symbol = typeChecker.getSymbolAtLocation(sourceFile);

            if (symbol == null) {
                Logger.Log(LogLevel.Warning, `Source file "${fileName}" is skipped, because no exported members were found!`);
                return;
            }

            const apiSourceFile = new ApiSourceFile(sourceFile, symbol, {
                Program: program,
                ItemsRegistry: itemsRegistry,
                ProjectDirectory: this.projectDirectory
            });

            apiSourceFiles.push(apiSourceFile);
        });

        return {
            Registry: this.getRegistryExtractedItems(itemsRegistry),
            EntryFiles: apiSourceFiles.map(x => x.Extract())
        };
    }

    private getRegistryExtractedItems(itemsRegistry: ApiItemsRegistry): RegistryExtractedItems {
        const items: RegistryExtractedItems = {};
        const apiItems = itemsRegistry.GetAll();

        Object.keys(apiItems).forEach(itemId => {
            items[itemId] = apiItems[itemId].Extract();
        });

        return items;
    }
}
