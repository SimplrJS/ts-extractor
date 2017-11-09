import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiClassMethodDto } from "../contracts/definitions/api-class-method-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { AccessModifier } from "../contracts/access-modifier";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export class ApiClassMethod extends ApiCallableBase<ts.MethodDeclaration, ApiClassMethodDto> {
    constructor(declaration: ts.MethodDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(declaration.modifiers, ts.SyntaxKind.StaticKeyword);
    }

    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;

    public IsPrivate(): boolean {
        return super.IsPrivate() || this.accessModifier === AccessModifier.Private;
    }

    public OnExtract(): ApiClassMethodDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.ClassMethod,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Parameters: this.parameters,
            ReturnType: this.returnType,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsStatic: this.isStatic,
            TypeParameters: this.typeParameters
        };
    }
}
