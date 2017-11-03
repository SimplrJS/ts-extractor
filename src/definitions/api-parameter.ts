import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiParameterDto } from "../contracts/definitions/api-parameter-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

export class ApiParameter extends ApiItem<ts.ParameterDeclaration, ApiParameterDto> {
    public GetReturnType(): TypeDto {
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);

        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiParameterDto {
        return {
            ApiKind: ApiItemKinds.Parameter,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: this.GetItemMetadata(),
            Type: this.GetReturnType()
        };
    }
}
