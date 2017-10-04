import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiMethodDto } from "../contracts/api-items/api-method-dto";
import { ApiItemReferenceDict } from "../contracts/api-items/api-item-reference-dict";
import { ApiItemType } from "../contracts/api-items/api-item-type";

import { ApiParameter } from "./api-parameter";

export class ApiMethod extends ApiItem<ts.MethodSignature, ApiMethodDto> {
    constructor(declaration: ts.MethodSignature, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        this.parameters = ApiHelpers.GetItemsFromDeclarationsIds(declaration.parameters, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });
    }

    private parameters: ApiItemReferenceDict = {};

    public GetReturnType(): string {
        return TSHelpers.GetReturnTypeTextFromDeclaration(this.Declaration, this.TypeChecker);
    }

    public Extract(): ApiMethodDto {
        return {
            Type: ApiItemType.Method,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Parameters: this.parameters,
            ReturnType: this.GetReturnType()
        };
    }
}
