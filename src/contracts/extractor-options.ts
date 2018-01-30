import * as ts from "typescript";

export interface ExtractorOptions {
    /**
     * TypeScript compiler options.
     */
    CompilerOptions: ts.CompilerOptions;
    /**
     * Full path to TypeScript project directory.
     */
    ProjectDirectory: string;
    /**
     * File locations that should not be included in extracted data.
     */
    Exclude?: string[];
    /**
     * Used to standartize paths in extracted data.
     */
    OutputPathSeparator?: string;
    /**
     * Package names to include in extracted data.
     */
    ExternalPackages?: string[];
    /**
     * Include TypeScript specific information in extracted data.
     */
    IncludeTsDebugInfo?: boolean;
}
