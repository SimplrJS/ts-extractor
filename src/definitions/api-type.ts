import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeDto } from "../contracts/definitions/api-type-dto";
import { ApiItemTypes } from "../contracts/api-item-types";

export class ApiType extends ApiItem<ts.TypeAliasDeclaration, ApiTypeDto> {
    public GetReturnType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public Extract(): ApiTypeDto {
        return {
            ApiType: ApiItemTypes.Type,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Type: this.GetReturnType()
        };
    }
}
