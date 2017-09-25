import * as ts from "typescript";

export namespace TSHelpers {
    export function TypeToString(declaration: ts.Declaration, symbol: ts.Symbol, typeChecker: ts.TypeChecker): string {
        const typeNode: ts.TypeNode | undefined = GetDeclarationTypeNode(declaration);
        if (typeNode != null) {
            return typeNode.getText();
        }

        const typeOfSymbol = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
        return typeChecker.typeToString(typeOfSymbol);
    }

    export function GetDeclarationTypeNode(declaration: ts.Declaration): ts.TypeNode | undefined {
        return (declaration as any).type;
    }
}
