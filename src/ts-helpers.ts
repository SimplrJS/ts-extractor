import * as ts from "typescript";

export namespace TSHelpers {
    /**
     * Returns the string part of `export * from "./module";`
     */
    export function GetExportImportString(declaration: ts.ExportDeclaration | ts.ImportDeclaration): string | undefined {
        const stringLiteralNode = declaration.getChildren().find(x => ts.isStringLiteral(x));
        if (stringLiteralNode == null || !ts.isStringLiteral(stringLiteralNode)) {
            return undefined;
        }

        return stringLiteralNode.text;
    }

    /**
     * Returns `ts.SourceFile` from `ts.ExportDeclaration`.
     */
    export function ResolveSourceFile(
        declaration: ts.ExportDeclaration | ts.ImportDeclaration,
        program: ts.Program
    ): ts.SourceFile | undefined {
        const declarationSourceFile = declaration.getSourceFile();
        const importString = GetExportImportString(declaration);
        if (importString == null) {
            return undefined;
        }

        // TODO: Resolve custom paths with custom paths.
        // const compilerPaths = program.getCompilerOptions().paths;
        const resolvedModule = GetResolvedModule(declarationSourceFile, importString);
        if (resolvedModule == null) {
            return undefined;
        }
        return program.getSourceFile(resolvedModule.resolvedFileName);
    }

    /**
     * Returns Symbol from declaration.
     */
    export function GetSymbolFromDeclaration(declaration: ts.Declaration, typeChecker: ts.TypeChecker): ts.Symbol | undefined {
        const symbol: ts.Symbol | undefined = typeChecker.getSymbolAtLocation(declaration);
        if (symbol != null) {
            return symbol;
        }

        /**
         * HACK: It's the only way to get symbol from declaration.
         * Remove this when TypeScript compiler will support getting symbols.
         */
        return (declaration as any).symbol;
    }

    export type TypeWithTypeArguments = ts.Type & { typeArguments: ts.Type[] };

    export function IsTypeWithTypeArguments(type: ts.Type): type is TypeWithTypeArguments {
        return (type as TypeWithTypeArguments).typeArguments != null;
    }

    export function IsTypeUnionOrIntersectionType(type: ts.Type): type is ts.UnionOrIntersectionType {
        return Boolean(type.flags & ts.TypeFlags.UnionOrIntersection);
    }

    export function IsTypeUnionType(type: ts.Type): type is ts.UnionType {
        return Boolean(type.flags & ts.TypeFlags.Union);
    }

    export function IsTypeIntersectionType(type: ts.Type): type is ts.IntersectionType {
        return Boolean(type.flags & ts.TypeFlags.Intersection);
    }

    export function GetResolvedModule(sourceFile: ts.SourceFile, moduleNameText: string): ts.ResolvedModuleFull | undefined {
        return sourceFile && (sourceFile as any).resolvedModules && (sourceFile as any).resolvedModules.get(moduleNameText);
    }

    /**
     * Source: @microsoft/api-extractor (MIT)
     * Github: https://goo.gl/tLoJUe
     */
    export function FollowSymbolAliases(symbol: ts.Symbol, typeChecker: ts.TypeChecker): ts.Symbol {
        let current: ts.Symbol = symbol;

        while (true) {
            if (!(current.flags & ts.SymbolFlags.Alias)) {
                break;
            }
            const currentAlias: ts.Symbol = typeChecker.getAliasedSymbol(current);
            if (!currentAlias || currentAlias === current) {
                break;
            }
            current = currentAlias;
        }

        return current;
    }
}
