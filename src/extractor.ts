import * as ts from "typescript";
import { PackageJson } from "read-package-json";

import { Logger, LogLevel } from "./utils/logger";
import { ApiSourceFile } from "./definitions/api-source-file";

export interface ExtractorOptions {
    compilerOptions: ts.CompilerOptions;
}

export class Extractor {
    constructor(options: ExtractorOptions) {
        this.compilerOptions = options.compilerOptions;
    }

    private compilerOptions: ts.CompilerOptions;

    private logErrorHandler(message: string, fileName: string, lineNumber: number | undefined): void {
        Logger.Log(LogLevel.Error, `TypeScript: [${fileName}:${lineNumber}] ${message}`);
    }

    public Extract(files: string[]): ApiSourceFile[] {
        const program = ts.createProgram(files, this.compilerOptions);

        // This runs a full type analysis, and then augments the Abstract Syntax Tree (i.e. declarations)
        // with semantic information (i.e. symbols).  The "diagnostics" are a subset of the everyday
        // compile errors that would result from a full compilation.
        for (const diagnostic of program.getSemanticDiagnostics()) {
            this.logErrorHandler(diagnostic.messageText.toString(), `${diagnostic.file}`, diagnostic.start);
        }

        const typeChecker = program.getTypeChecker();
        const apiSourceFiles: ApiSourceFile[] = [];

        program.getRootFileNames().forEach(fileName => {
            const sourceFile: ts.SourceFile = program.getSourceFile(files[0]);

            const apiSourceFile = new ApiSourceFile(sourceFile, {
                typeChecker: typeChecker,
                program: program
            });

            apiSourceFiles.push(apiSourceFile);
        });

        return apiSourceFiles;
    }
}
