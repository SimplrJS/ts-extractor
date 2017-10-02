import * as ts from "typescript";
import * as path from "path";

export namespace TSHelpers {
    export type DeclarationWithTypeNode = ts.Declaration & { type?: ts.TypeNode };

    // TODO: Remove this function.
    export function TypeToString(declaration: DeclarationWithTypeNode, symbol: ts.Symbol, typeChecker: ts.TypeChecker): string {
        const typeOfSymbol = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
        return typeChecker.typeToString(typeOfSymbol);
    }

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
        const declarationSourceFilename = declaration.getSourceFile().fileName;
        const importString = GetExportDeclarationImportString(declaration);
        if (importString == null) {
            return undefined;
        }

        // TODO: Resolve custom paths with custom paths.
        // const compilerPaths = program.getCompilerOptions().paths;
        const fullPath = path.resolve(declarationSourceFilename, importString);
        return program.getSourceFiles().find(x => x.fileName.indexOf(fullPath) !== 1 && !x.isDeclarationFile);
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

    export type HeritageKinds = ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword;

    export function GetHeritageList(
        heritageClauses: ts.NodeArray<ts.HeritageClause>,
        kind: HeritageKinds,
        typeChecker: ts.TypeChecker
    ): string[] {
        const list: string[] = [];

        heritageClauses.forEach(heritage => {
            if (heritage.token !== kind) {
                return;
            }

            heritage.types.forEach(expressionType => {
                const type = typeChecker.getTypeFromTypeNode(expressionType);
                list.push(typeChecker.typeToString(type));
            });
        });

        return list;
    }
}
