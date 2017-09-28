import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";

export class ApiVariable extends ApiItem {
    constructor(declaration: ts.VariableDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);
    }

    public GetType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public ToJson(): { [key: string]: any; } {
        return {
            Kind: "variable",
            Name: this.Symbol.getName(),
            ReturnType: this.GetType()
        };
    }
}
