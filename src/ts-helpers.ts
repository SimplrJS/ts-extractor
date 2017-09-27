import * as ts from "typescript";
import * as path from "path";

export namespace TSHelpers {
    export type DeclarationWithTypeNode = ts.Declaration & { type?: ts.TypeNode };

    export function TypeToString(declaration: DeclarationWithTypeNode, symbol: ts.Symbol, typeChecker: ts.TypeChecker): string {
        if (declaration.type != null) {
            return declaration.type.getText();
        }

        const typeOfSymbol = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
        return typeChecker.typeToString(typeOfSymbol);
    }

    /**
     * Get the string part of `export * from "./module";`
     */
    export function GetExportDeclarationImportString(declaration: ts.ExportDeclaration): string | undefined {
        const stringLiteralNode = declaration.getChildren().find(x => ts.isStringLiteral(x));
        if (stringLiteralNode == null || !ts.isStringLiteral(stringLiteralNode)) {
            return undefined;
        }

        return stringLiteralNode.text;
    }

    /**
     * Get `ts.SourceFile` from `ts.ExportDeclaration`.
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
}
