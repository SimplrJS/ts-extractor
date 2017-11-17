import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiClassMethodDto } from "../contracts/definitions/api-class-method-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { AccessModifier } from "../contracts/access-modifier";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export class ApiClassMethod extends ApiCallableBase<ts.MethodDeclaration, ApiClassMethodDto> {
    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private isOptional: boolean;
    private isAsync: boolean;

    public IsPrivate(): boolean {
        return super.IsPrivate() || this.accessModifier === AccessModifier.Private;
    }

    public OnGatherData(): void {
        super.OnGatherData();

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(this.Declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.StaticKeyword);
        this.isAsync = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AsyncKeyword);

        // IsOptional
        this.isOptional = Boolean((this.Declaration as ts.FunctionLikeDeclarationBase).questionToken);
    }

    public OnExtract(): ApiClassMethodDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.ClassMethod,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsStatic: this.isStatic,
            IsOptional: this.isOptional,
            IsAsync: this.isAsync,
            TypeParameters: this.TypeParameters
        };
    }
}
