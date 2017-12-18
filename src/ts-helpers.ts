import * as ts from "typescript";

export namespace TSHelpers {
    /**
     * Returns the string part of `export * from "./module";`
     */
    export function GetExportImportString(
        declaration: ts.ExportDeclaration | ts.ImportDeclaration
    ): string | undefined {
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
    export function GetSymbolFromDeclaration(declaration: ts.Declaration | undefined, typeChecker: ts.TypeChecker): ts.Symbol | undefined {
        if (declaration == null) {
            return undefined;
        }

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

    export function GetDeclarationParent(declaration: ts.Declaration, kind: ts.SyntaxKind): ts.Node | undefined {
        let current: ts.Node | undefined = declaration;

        while (true) {
            if (current != null && current.kind === kind) {
                break;
            } else if (current != null) {
                current = current.parent;
            } else {
                break;
            }
        }

        return current;
    }

    export function GetImportSpecifierLocalTargetSymbol(declaration: ts.ImportSpecifier, program: ts.Program): ts.Symbol | undefined {
        // Get ImportDeclaration
        const importDeclaration = GetDeclarationParent(declaration, ts.SyntaxKind.ImportDeclaration);
        if (importDeclaration == null || !ts.isImportDeclaration(importDeclaration)) {
            return undefined;
        }

        // Resolve target SourceFile
        const symbol = GetSymbolFromDeclaration(declaration, program.getTypeChecker());
        const sourceFile = ResolveSourceFile(importDeclaration, program);
        const sourceFileSymbol = GetSymbolFromDeclaration(sourceFile, program.getTypeChecker());
        if (sourceFile == null || symbol == null || sourceFileSymbol == null || sourceFileSymbol.exports == null) {
            return undefined;
        }

        // Return from resolved source file exported symbol of ImportSpecifier
        return sourceFileSymbol.exports.get(symbol.escapedName);
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
