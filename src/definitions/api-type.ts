import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeDto } from "../contracts/definitions/api-type-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";

export class ApiType extends ApiItem<ts.TypeAliasDeclaration, ApiTypeDto> {
    public GetReturnType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public Extract(): ApiTypeDto {
        return {
            ApiKind: ApiItemKinds.Type,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Type: this.GetReturnType()
        };
    }
}
