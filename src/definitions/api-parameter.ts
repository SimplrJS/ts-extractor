import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiParameterDto } from "../contracts/api-items/api-parameter-dto";
import { ApiItemType } from "../contracts/api-items/api-item-type";

export class ApiParameter extends ApiItem<ts.ParameterDeclaration, ApiParameterDto> {
    public GetReturnType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public Extract(): ApiParameterDto {
        return {
            ApiType: ApiItemType.Namespace,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            ReturnType: this.GetReturnType()
        };
    }
}
