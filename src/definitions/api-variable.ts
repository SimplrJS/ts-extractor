import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiVariableDto } from "../contracts/api-items/api-variable-dto";
import { ApiItemType } from "../contracts/api-items/api-item-type";

export class ApiVariable extends ApiItem<ts.VariableDeclaration, ApiVariableDto> {
    public GetType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public Extract(): ApiVariableDto {
        return {
            ApiType: ApiItemType.Variable,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Type: this.GetType()
        };
    }
}
