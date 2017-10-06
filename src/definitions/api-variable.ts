import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiVariableDto } from "../contracts/definitions/api-variable-dto";
import { ApiItemTypes } from "../contracts/api-item-types";
import { ApiTypeDto } from "../contracts/type-dto";

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
            ApiType: ApiItemTypes.Variable,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Type: this.GetType()
        };
    }
}
