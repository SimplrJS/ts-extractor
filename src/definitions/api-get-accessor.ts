import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiItem } from "../abstractions/api-item";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiGetAccessorDto } from "../contracts/definitions/api-get-accessor-dto";
import { ApiType } from "../contracts/api-type";
import { AccessModifier } from "../contracts/access-modifier";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiGetAccessor extends ApiItem<ts.GetAccessorDeclaration, ApiGetAccessorDto> {
    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private type: ApiType;

    protected OnGatherData(): void {
        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(this.Declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.StaticKeyword);

        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, type, this.Declaration.type);
    }

    public OnExtract(): ApiGetAccessorDto {
        const parentId: string | undefined = this.GetParentId();
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.GetAccessor,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: location,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsStatic: this.isStatic,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
