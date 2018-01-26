import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiEnumDto } from "../contracts/api-definitions";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiDefinitionKind } from "../contracts/api-item-kind";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiEnum extends ApiItem<ts.EnumDeclaration, ApiEnumDto> {
    private location: ApiItemLocationDto;
    private members: ApiItemReference[] = [];
    private isConst: boolean;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // IsConst
        this.isConst = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ConstKeyword);

        // Members
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);

    }

    public OnExtract(): ApiEnumDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiDefinitionKind.Enum,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            IsConst: this.isConst,
            Members: this.members,
            _ts: this.GetTsDebugInfo()
        };
    }
}
