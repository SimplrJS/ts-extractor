import * as ts from "typescript";
import { PackageJson } from "read-package-json";

import { Logger, LogLevel } from "./utils/logger";

export interface ExtractorOptions {
    compilerOptions: ts.CompilerOptions;
}

export class Extractor {
    private compilerOptions: ts.CompilerOptions;
    public typeChecker: ts.TypeChecker;

    constructor(options: ExtractorOptions) {
        this.compilerOptions = options.compilerOptions;
    }

    private logErrorHandler(message: string, fileName: string, lineNumber: number | undefined): void {
        Logger.Log(LogLevel.Error, `TypeScript: [${fileName}:${lineNumber}] ${message}`);
    }

    public Analyze(entryFile: string): void {
        const files: string[] = [entryFile];

        const program = ts.createProgram(files, this.compilerOptions);

        // This runs a full type analysis, and then augments the Abstract Syntax Tree (i.e. declarations)
        // with semantic information (i.e. symbols).  The "diagnostics" are a subset of the everyday
        // compile errors that would result from a full compilation.
        for (const diagnostic of program.getSemanticDiagnostics()) {
            this.logErrorHandler(diagnostic.messageText.toString(), `${diagnostic.file}`, diagnostic.start);
        }

        this.typeChecker = program.getTypeChecker();

        // We are getting specific file,
        // because TS program loads other files like: lib.d.ts
        // TODO: Add getting source from list of files.
        const rootFile: ts.SourceFile = program.getSourceFile(entryFile);

        // SourceFile doesn't have symbol property, weird.
        const moduleSymbol: ts.Symbol = (rootFile as any).symbol;

        if (moduleSymbol.exports != null) {
            moduleSymbol.exports.forEach(exportedMember => {
                console.log(exportedMember.getJsDocTags());
            });
        }


    }
}
