import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiProperty extends ApiItem<ts.PropertySignature> {
    public GetType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public ToJson(): { [key: string]: any; } {
        return {
            Kind: "property",
            Name: this.Symbol.name,
            ReturnType: this.GetType()
        };
    }
}
