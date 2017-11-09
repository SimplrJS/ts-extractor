import * as ts from "typescript";

export interface ExtractorOptions {
    CompilerOptions: ts.CompilerOptions;
    ProjectDirectory: string;
    Exclude: string[];
    OutputPathSeparator?: string;
}
