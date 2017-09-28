import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiPropertySignature extends ApiItem {
    constructor(declaration: ts.PropertySignature, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);
    }

    public GetType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public ToJson(): { [key: string]: any; } {
        return {
            Kind: "property-signature",
            Name: this.Symbol.name,
            Type: this.GetType()
        };
    }
}
