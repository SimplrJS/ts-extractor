import * as ts from "typescript";

import { ApiCallableBase } from "../abstractions/api-callable-base";
import { ApiHelpers } from "../api-helpers";
import { ApiClassConstructorDto } from "../contracts/definitions/api-class-constructor-dto";
import { ApiItemKind } from "../contracts/api-item-kind";
import { AccessModifier } from "../contracts/access-modifier";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";

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

        return {
            ApiKind: ApiItemKind.ClassConstructor,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.Location,
            IsOverloadBase: this.IsOverloadBase,
            Parameters: this.Parameters,
            AccessModifier: this.accessModifier,
            TypeParameters: this.TypeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
