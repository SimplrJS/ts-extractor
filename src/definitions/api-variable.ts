import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiVariableDto } from "../contracts/api-items/api-variable-dto";
import { ApiItemType } from "../contracts/api-items/api-item-type";
import { ApiTypeDto } from "../contracts/api-items/api-type-dto";

export class ApiVariable extends ApiItem<ts.VariableDeclaration, ApiVariableDto> {
    public GetType(): ApiTypeDto {
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);

        const a = ApiHelpers.TypeToApiTypeDto(type, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });

        debugger;

        return a;
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
