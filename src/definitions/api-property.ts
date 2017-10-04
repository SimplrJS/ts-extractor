import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiPropertyDto } from "../contracts/api-items/api-property-dto";
import { ApiItemType } from "../contracts/api-items/api-item-type";

export class ApiProperty extends ApiItem<ts.PropertySignature, ApiPropertyDto> {
    public GetReturnType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public Extract(): ApiPropertyDto {
        return {
            Type: ApiItemType.Property,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            ReturnType: this.GetReturnType()
        };
    }
}
