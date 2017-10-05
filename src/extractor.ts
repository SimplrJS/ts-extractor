import * as ts from "typescript";
import { PackageJson } from "read-package-json";

import { Logger, LogLevel } from "./utils/logger";
import { ApiSourceFile } from "./definitions/api-source-file";
import { ApiItemsRegistry } from "./api-items-registry";
import { RegistryDict } from "./contracts/items-registry";
import { ApiItem } from "./abstractions/api-item";
import { ApiSourceFileDto } from "./contracts/api-items/api-source-file-dto";
import { ApiItemDto } from "./contracts/api-items/api-item-dto";

export type RegistryExtractedItems = { [key: string]: ApiItemDto };

export interface ExtractDto {
    Registry: RegistryExtractedItems;
    EntryFiles: ApiSourceFileDto[];
}

export interface ExtractorOptions {
    compilerOptions: ts.CompilerOptions;
}

export class Extractor {
    constructor(options: ExtractorOptions) {
        this.compilerOptions = options.compilerOptions;
        this.itemsRegistry = new ApiItemsRegistry();
    }

    private compilerOptions: ts.CompilerOptions;
    private itemsRegistry: ApiItemsRegistry;

    private logErrorHandler(message: string, fileName: string, lineNumber: number | undefined): void {
        Logger.Log(LogLevel.Error, `TypeScript: [${fileName}:${lineNumber}] ${message}`);
    }

    public Extract(files: string[]): ExtractDto {
        const program = ts.createProgram(files, this.compilerOptions);

        // This runs a full type analysis, and then augments the Abstract Syntax Tree (i.e. declarations)
        // with semantic information (i.e. symbols).  The "diagnostics" are a subset of the everyday
        // compile errors that would result from a full compilation.
        for (const diagnostic of program.getSemanticDiagnostics()) {
            this.logErrorHandler(diagnostic.messageText.toString(), `${diagnostic.file}`, diagnostic.start);
        }

        const typeChecker = program.getTypeChecker();
        const apiSourceFiles: ApiSourceFile[] = [];

        const rootFiles = program.getRootFileNames();
        rootFiles.forEach(fileName => {
            const sourceFile: ts.SourceFile = program.getSourceFile(fileName);

            const apiSourceFile = new ApiSourceFile(sourceFile, {
                Program: program,
                ItemsRegistry: this.itemsRegistry
            });

            apiSourceFiles.push(apiSourceFile);
        });

        return {
            Registry: this.getRegistryExtractedItems(),
            EntryFiles: apiSourceFiles.map(x => x.Extract())
        };
    }

    private getRegistryExtractedItems(): RegistryExtractedItems {
        const items: RegistryExtractedItems = {};
        const apiItems = this.itemsRegistry.GetAll();

        Object.keys(apiItems).forEach(itemId => {
            items[itemId] = apiItems[itemId].Extract();
        });

        return items;
    }
}
