import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiParameter extends ApiItem {
    constructor(declaration: ts.ParameterDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);
    }

    public GetType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public ToJson(): { [key: string]: any; } {
        return {
            Kind: "parameter",
            Name: this.Symbol.name,
            Type: this.GetType()
        };
    }
}
