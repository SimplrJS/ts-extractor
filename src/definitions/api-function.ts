import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiParameter } from "./api-parameter";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiFunction extends ApiItem {
    constructor(declaration: ts.FunctionDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);
        this.parameters = {};

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

    private parameters: { [key: string]: ApiParameter };

    public GetType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public ToJson(): { [key: string]: any; } {
        const parametersJson: { [key: string]: any } = {};

        for (const parameterKey in this.parameters) {
            if (this.parameters.hasOwnProperty(parameterKey)) {
                parametersJson[parameterKey] = this.parameters[parameterKey].ToJson();
            }
        }

        return {
            Kind: "function",
            Type: this.GetType(),
            Parameters: parametersJson
        };
    }
}
