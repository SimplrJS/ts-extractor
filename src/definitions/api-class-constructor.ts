import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiClassConstructorDto } from "../contracts/definitions/api-class-constructor-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { AccessModifier } from "../contracts/access-modifier";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiClassConstructor extends ApiItem<ts.ConstructorDeclaration, ApiClassConstructorDto> {
    private isOverloadBase: boolean;
    private parameters: ApiItemReference[] = [];
    private accessModifier: AccessModifier;

    protected OnGatherData(): void {
        // Overload
        this.isOverloadBase = this.TypeChecker.isImplementationOfOverload(this.Declaration) || false;

        // Parameters
        this.parameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.parameters, this.Options);

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(this.Declaration.modifiers);
    }

    public OnExtract(): ApiClassConstructorDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.ClassConstructor,
            Name: this.Symbol.name,
            Metadata: metadata,
            Location: location,
            IsOverloadBase: this.isOverloadBase,
            Parameters: this.parameters,
            AccessModifier: this.accessModifier,
            _ts: this.GetTsDebugInfo()
        };
    }
}
