import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiPropertyDto } from "../contracts/definitions/api-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

export class ApiClassProperty extends ApiItem<ts.PropertyDeclaration, ApiPropertyDto> {
    public GetReturnType(): TypeDto {
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);

        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiPropertyDto {
        return {
            ApiKind: ApiItemKinds.ClassProperty,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Type: this.GetReturnType()
        };
    }
}
