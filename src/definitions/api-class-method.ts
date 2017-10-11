import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiClassMethodDto } from "../contracts/definitions/api-class-method-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ModifiersDto } from "../contracts/modifiers-dto";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";

export class ApiClassMethod extends ApiItem<ts.MethodDeclaration, ApiClassMethodDto> {
    constructor(declaration: ts.MethodDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        this.parameters = ApiHelpers.GetItemsFromDeclarationsIds(declaration.parameters, this.Options);
        this.modifiers = ApiHelpers.FromModifiersToModifiersDto(declaration.modifiers);
    }

    private parameters: ApiItemReferenceDict = {};
    private modifiers: ModifiersDto;

    public GetReturnType(): TypeDto | undefined {
        const signature = this.TypeChecker.getSignatureFromDeclaration(this.Declaration);
        if (signature == null) {
            return;
        }
        const type = this.TypeChecker.getReturnTypeOfSignature(signature);

        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiClassMethodDto {
        return {
            ApiKind: ApiItemKinds.ClassMethod,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Parameters: this.parameters,
            ReturnType: this.GetReturnType(),
            ...this.modifiers
        };
    }
}
