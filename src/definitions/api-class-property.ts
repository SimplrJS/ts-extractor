import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiClassPropertyDto } from "../contracts/definitions/api-class-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiType } from "../contracts/api-type";
import { AccessModifier } from "../contracts/access-modifier";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiClassProperty extends ApiItem<ts.PropertyDeclaration, ApiClassPropertyDto> {
    private location: ApiItemLocationDto;
    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private isReadonly: boolean;
    private isOptional: boolean;
    private type: ApiType;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(this.Declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.StaticKeyword);
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);

        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.type);
    }

    public OnExtract(): ApiClassPropertyDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.ClassProperty,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsReadonly: this.isReadonly,
            IsStatic: this.isStatic,
            IsOptional: this.isOptional,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
