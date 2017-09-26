import * as ts from "typescript";

export namespace TSHelpers {
    export type DeclarationWithTypeNode = ts.Declaration & { type?: ts.TypeNode };

    export function TypeToString(declaration: DeclarationWithTypeNode, symbol: ts.Symbol, typeChecker: ts.TypeChecker): string {
        if (declaration.type != null) {
            return declaration.type.getText();
        }

        const typeOfSymbol = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
        return typeChecker.typeToString(typeOfSymbol);
    }
}
