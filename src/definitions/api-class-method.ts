import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiClassMethodDto } from "../contracts/definitions/api-class-method-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { AccessModifier } from "../contracts/access-modifier";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiClassMethod extends ApiCallableBase<ts.MethodDeclaration, ApiClassMethodDto> {
    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private isOptional: boolean;
    private isAsync: boolean;

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
        const parentId: string | undefined = this.GetParentId();
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.ClassMethod,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: location,
            IsOverloadBase: this.IsOverloadBase,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsStatic: this.isStatic,
            IsOptional: this.isOptional,
            IsAsync: this.isAsync,
            TypeParameters: this.TypeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
