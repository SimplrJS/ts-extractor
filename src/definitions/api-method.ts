import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiParameter } from "./api-parameter";

export class ApiMethod extends ApiItem<ts.MethodSignature> {
    constructor(declaration: ts.MethodSignature, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        declaration.parameters.forEach(parameterDeclaration => {
            const a = ts.getParseTreeNode(parameterDeclaration);
            const parameterSymbol = TSHelpers.GetSymbolFromDeclaration(parameterDeclaration, this.TypeChecker);
            if (parameterSymbol == null) {
                return;
            }

            this.parameters[parameterSymbol.name] = new ApiParameter(parameterDeclaration, parameterSymbol, {
                program: this.Program,
                typeChecker: this.TypeChecker
            });
        });
    }

    private parameters: { [key: string]: any } = {};

    public GetReturnType(): string {
        return TSHelpers.GetReturnTypeTextFromDeclaration(this.Declaration, this.TypeChecker);
    }

    public ToJson(): { [key: string]: any; } {
        const parametersJson: { [key: string]: any } = {};

        for (const parameterKey in this.parameters) {
            if (this.parameters.hasOwnProperty(parameterKey)) {
                parametersJson[parameterKey] = this.parameters[parameterKey].ToJson();
            }
        }

        return {
            Kind: "method",
            Name: this.Symbol.name,
            Parameters: parametersJson,
            ReturnType: this.GetReturnType()
        };
    }
}
