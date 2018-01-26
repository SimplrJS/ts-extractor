import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiItem } from "../abstractions/api-item";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiDefinitionKind, ApiGetAccessorDto } from "../contracts/api-definitions";
import { ApiType } from "../contracts/api-types";
import { AccessModifier } from "../contracts/access-modifier";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiGetAccessor extends ApiItem<ts.GetAccessorDeclaration, ApiGetAccessorDto> {
    private location: ApiItemLocationDto;
    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private type: ApiType;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(this.Declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.StaticKeyword);

        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.type);
    }

    public OnExtract(): ApiGetAccessorDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiDefinitionKind.GetAccessor,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsStatic: this.isStatic,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
