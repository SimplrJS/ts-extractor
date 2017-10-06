import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiMethodDto } from "../contracts/definitions/api-method-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

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

    public GetReturnType(): TypeDto {
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);

        return ApiHelpers.TypeToApiTypeDto(type, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });
    }

    public Extract(): ApiMethodDto {
        return {
            ApiKind: ApiItemKinds.Method,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Parameters: this.parameters,
            ReturnType: this.GetReturnType()
        };
    }
}
