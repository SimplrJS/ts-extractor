import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiParameter } from "./api-parameter";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiFunction extends ApiItem<ts.FunctionDeclaration> {
    constructor(declaration: ts.FunctionDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Parameters
        declaration.parameters.forEach(parameterDeclaration => {
            const a = ts.getParseTreeNode(parameterDeclaration);
            const parameterSymbol = TSHelpers.GetSymbolFromDeclaration(parameterDeclaration, this.TypeChecker);
            if (parameterSymbol == null) {
                return;
            }

            this.parameters[parameterSymbol.name] = new ApiParameter(parameterDeclaration, parameterSymbol, {
                Program: this.Program,
                ItemsRegistry: this.ItemsRegistry
            });
        });
    }

    private parameters: { [key: string]: ApiParameter } = {};

    public GetReturnType(): string {
        return TSHelpers.GetReturnTypeTextFromDeclaration(this.Declaration as ts.FunctionDeclaration, this.TypeChecker);
    }

    public Extract(): { [key: string]: any; } {
        const parametersJson: { [key: string]: any } = {};

        for (const parameterKey in this.parameters) {
            if (this.parameters.hasOwnProperty(parameterKey)) {
                parametersJson[parameterKey] = this.parameters[parameterKey].Extract();
            }
        }

        return {
            Kind: "function",
            ReturnType: this.GetReturnType(),
            Parameters: parametersJson
        };
    }
}
