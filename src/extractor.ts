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
    private typeChecker: ts.TypeChecker;
    private files: ApiSourceFile[] = [];

    private logErrorHandler(message: string, fileName: string, lineNumber: number | undefined): void {
        Logger.Log(LogLevel.Error, `TypeScript: [${fileName}:${lineNumber}] ${message}`);
    }

    public Analyze(files: string[]): void {
        const program = ts.createProgram(files, this.compilerOptions);

        // This runs a full type analysis, and then augments the Abstract Syntax Tree (i.e. declarations)
        // with semantic information (i.e. symbols).  The "diagnostics" are a subset of the everyday
        // compile errors that would result from a full compilation.
        for (const diagnostic of program.getSemanticDiagnostics()) {
            this.logErrorHandler(diagnostic.messageText.toString(), `${diagnostic.file}`, diagnostic.start);
        }

        this.typeChecker = program.getTypeChecker();

        program.getRootFileNames().forEach(fileName => {
            const sourceFile: ts.SourceFile = program.getSourceFile(files[0]);

            const apiSourceFile = new ApiSourceFile(sourceFile, {
                typeChecker: this.typeChecker,
                program: program
            });

            this.files.push(apiSourceFile);
        });
    }

    public GetFiles(): ApiSourceFile[] {
        return this.files;
    }
}
