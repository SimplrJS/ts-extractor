import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiClassMethodDto } from "../contracts/definitions/api-class-method-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { AccessModifier } from "../contracts/access-modifier";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";

export class ApiClassMethod extends ApiItem<ts.MethodDeclaration, ApiClassMethodDto> {
    constructor(declaration: ts.MethodDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        this.parameters = ApiHelpers.GetItemsFromDeclarationsIds(declaration.parameters, this.Options);

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.StaticKeyword);
    }

    private parameters: ApiItemReferenceDict = {};
    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;

    public GetIsPrivate(): boolean {
        return this.accessModifier === AccessModifier.Private;
    }

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
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsStatic: this.isStatic
        };
    }
}
