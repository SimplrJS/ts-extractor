import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiItem } from "../abstractions/api-item";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiGetAccessorDto } from "../contracts/definitions/api-get-accessor-dto";
import { TypeDto } from "../contracts/type-dto";
import { AccessModifier } from "../contracts/access-modifier";

export class ApiGetAccessor extends ApiItem<ts.GetAccessorDeclaration, ApiGetAccessorDto> {
    private accessModifier: AccessModifier;
    private isAbstract: boolean;
    private isStatic: boolean;
    private type: TypeDto;

    protected OnGatherData(): void {
        // Modifiers
        this.accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(this.Declaration.modifiers);
        this.isAbstract = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AbstractKeyword);
        this.isStatic = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.StaticKeyword);

        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public OnExtract(): ApiGetAccessorDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.GetAccessor,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            AccessModifier: this.accessModifier,
            IsAbstract: this.isAbstract,
            IsStatic: this.isStatic,
            Type: this.type
        };
    }
}
