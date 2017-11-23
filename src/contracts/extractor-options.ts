import * as ts from "typescript";

export interface ExtractorOptions {
    CompilerOptions: ts.CompilerOptions;
    ProjectDirectory: string;
    /**
     * Not Yet implemented.
     */
    Exclude?: string[];
    OutputPathSeparator?: string;
}
