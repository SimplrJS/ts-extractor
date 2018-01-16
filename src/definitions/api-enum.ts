import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiEnumDto } from "../contracts/definitions/api-enum-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiEnum extends ApiItem<ts.EnumDeclaration, ApiEnumDto> {
    private members: ApiItemReference[] = [];
    private isConst: boolean;

    protected OnGatherData(): void {
        // IsConst
        this.isConst = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ConstKeyword);

        // Members
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);

    }

    public OnExtract(): ApiEnumDto {
        const parentId: string | undefined = this.GetParentId();
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Enum,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: location,
            IsConst: this.isConst,
            Members: this.members,
            _ts: this.GetTsDebugInfo()
        };
    }
}
