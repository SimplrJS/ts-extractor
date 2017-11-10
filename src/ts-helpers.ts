import * as ts from "typescript";
import * as path from "path";

export namespace TSHelpers {
    export type DeclarationWithTypeNode = ts.Declaration & { type?: ts.TypeNode };

    export function GetTypeTextFromDeclaration(declaration: DeclarationWithTypeNode): string {
        if (declaration.type == null) {
            return "???";
        }

        return declaration.type.getText();
    }

    export function GetReturnTypeTextFromDeclaration(declaration: ts.SignatureDeclaration, typeChecker: ts.TypeChecker): string {
        const signature = typeChecker.getSignatureFromDeclaration(declaration);
        if (signature == null) {
            return "???";
        }
        const type = typeChecker.getReturnTypeOfSignature(signature);

        return typeChecker.typeToString(type);
    }

    /**
     * Returns the string part of `export * from "./module";`
     */
    export function GetExportDeclarationImportString(declaration: ts.ExportDeclaration): string | undefined {
        const stringLiteralNode = declaration.getChildren().find(x => ts.isStringLiteral(x));
        if (stringLiteralNode == null || !ts.isStringLiteral(stringLiteralNode)) {
            return undefined;
        }

        return stringLiteralNode.text;
    }

    /**
     * Returns `ts.SourceFile` from `ts.ExportDeclaration`.
     */
    export function GetSourceFileFromExport(declaration: ts.ExportDeclaration, program: ts.Program): ts.SourceFile | undefined {
        const declarationSourceFile = declaration.getSourceFile();
        const importString = GetExportDeclarationImportString(declaration);
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
     * Taken from @microsoft/api-extractor (MIT)
     * Source: https://goo.gl/tLoJUe
     */
    export function FollowAliases(symbol: ts.Symbol, typeChecker: ts.TypeChecker): ts.Symbol {
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
