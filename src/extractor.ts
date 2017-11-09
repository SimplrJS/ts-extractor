import * as ts from "typescript";
import * as os from "os";
import * as fs from "fs-extra";
import { PackageJson } from "read-package-json";
import * as path from "path";

import { Logger, LogLevel } from "./utils/logger";
import { ApiSourceFile } from "./definitions/api-source-file";
// import { ApiItemsRegistry } from "./api-registry";
// import { Dictionary } from "./contracts/registry";
import { ApiItem } from "./abstractions/api-item";
import { ApiSourceFileDto } from "./contracts/definitions/api-source-file-dto";
import { ApiBaseItemDto } from "./contracts/api-base-item-dto";
import { ExtractorOptions } from "./contracts/extractor-options";
import { ApiRegistry, ExtractedApiRegistry } from "./api-registry";

// export type RegistryExtractedItems = { [key: string]: ApiBaseItemDto };

export interface ExtractDto {
    Registry: ExtractedApiRegistry;
    EntryFiles: ApiSourceFileDto[];
}

export class Extractor {
    constructor(options: ExtractorOptions) {
        this.Options = {
            ...options,
            ProjectDirectory: fs.realpathSync(options.ProjectDirectory),
            OutputPathSeparator: options.OutputPathSeparator || "/"
        };
    }

    protected Options: ExtractorOptions;

    public Extract(files: string[]): ExtractDto {
        const rootNames = files.map(file => {
            if (path.isAbsolute(file)) {
                return file;
            }

            return path.join(this.Options.ProjectDirectory, file);
        });

        // Check whether files exist and are in project directory.
        rootNames.forEach(filePath => {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Given file "${filePath}", does not exist.`);
            }

            if (fs.realpathSync(filePath).indexOf(this.Options.ProjectDirectory) === -1) {
                throw new Error(`Given file "${filePath}", is not in project directory "${this.Options.ProjectDirectory}".`);
            }
        });

        const program = ts.createProgram(rootNames, this.Options.CompilerOptions);
        const apiRegistry = new ApiRegistry();

        // This runs a full type analysis, and augments the Abstract Syntax Tree (i.e. declarations)
        // with semantic information (i.e. symbols). The "diagnostics" are a subset of everyday
        // compile errors that would result from a full compilation.
        const diagnostics = program.getSemanticDiagnostics();
        if (diagnostics.length > 0) {
            const str = ts.formatDiagnosticsWithColorAndContext(program.getSemanticDiagnostics(), {
                getCanonicalFileName: () => __filename,
                getCurrentDirectory: () => this.Options.ProjectDirectory,
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
                Logger.Log(LogLevel.Warning, `Source file "${fileName}" is skipped, because no exported members were found.`);
                return;
            }

            const apiSourceFile = new ApiSourceFile(sourceFile, symbol, {
                Program: program,
                ExtractorOptions: this.Options,
                // ApiSourceFile populates given apiItemsRegistry by adding items into it
                Registry: apiRegistry,
                AddItemToRegistry: (apiItem: ApiItem) => apiRegistry.AddItem(apiItem)
            });

            apiSourceFiles.push(apiSourceFile);
            apiSourceFile.GatherData();
        });

        const extractedApiRegistry = apiRegistry.Extract();

        // Extracts every source file
        const extractedEntryFiles = apiSourceFiles.map(x => x.Extract());

        return {
            Registry: extractedApiRegistry,
            EntryFiles: extractedEntryFiles
        };
    }
}
