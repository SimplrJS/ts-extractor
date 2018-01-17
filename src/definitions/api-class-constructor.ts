import * as ts from "typescript";

import { ApiCallableBase } from "../abstractions/api-callable-base";
import { ApiHelpers } from "../api-helpers";
import { ApiClassConstructorDto } from "../contracts/definitions/api-class-constructor-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { AccessModifier } from "../contracts/access-modifier";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiClassConstructor extends ApiCallableBase<ts.ConstructorDeclaration, ApiClassConstructorDto> {
    private accessModifier: AccessModifier;

    protected OnGatherData(): void {
        super.OnGatherData();

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(this.Declaration.modifiers);
    }

    public OnExtract(): ApiClassConstructorDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.ClassConstructor,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: location,
            IsOverloadBase: this.IsOverloadBase,
            Parameters: this.Parameters,
            AccessModifier: this.accessModifier,
            TypeParameters: this.TypeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
