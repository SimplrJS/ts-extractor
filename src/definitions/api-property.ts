import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiPropertyDto } from "../contracts/definitions/api-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";

export class ApiProperty extends ApiItem<ts.PropertySignature, ApiPropertyDto> {
    public GetReturnType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public Extract(): ApiPropertyDto {
        return {
            ApiKind: ApiItemKinds.Property,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            ReturnType: this.GetReturnType()
        };
    }
}
