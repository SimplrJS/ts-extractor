import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

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
    /**
     * Filters ApiItems that should not appear in extracted data.
     * Example: ApiItem with private access modifiers should be omitted from extracted data.
     * ```ts
     * const extractor = new Extractor({
     *     CompilerOptions: compilerOptions,
     *     ProjectDirectory: projectDirectory,
     *     FilterApiItems: apiItem => {
     *         // Check Access Modifier.
     *         const accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(apiItem.Declaration.modifiers);
     *         if (accessModifier === AccessModifier.Private) {
     *             return false;
     *         }
     *
     *         // Look for JSDocTag "@private"
     *         const metadata = apiItem.GetItemMetadata();
     *         if (metadata.JSDocTags.findIndex(x => x.name === "private") !== -1) {
     *             return false;
     *         }
     *
     *         return true;
     *     }
     * });
     * ```
     */
    FilterApiItems?: FilterApiItemsHandler;
}

export type FilterApiItemsHandler = (apiitem: ApiItem) => boolean;
