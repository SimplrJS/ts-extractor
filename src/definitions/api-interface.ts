import * as ts from "typescript";

import { ApiItem } from "../abstractions/api-item";
import { ApiHelpers } from "../api-helpers";
import { ApiInterfaceDto } from "../contracts/api-definitions";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemKind } from "../contracts/api-item-kind";
import { ApiType } from "../contracts/api-type";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiInterface extends ApiItem<ts.InterfaceDeclaration, ApiInterfaceDto> {
    private location: ApiItemLocationDto;
    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: ApiType[] = [];
    private typeParameters: ApiItemReference[] = [];
    private members: ApiItemReference[] = [];

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Members
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);

        // Extends
        if (this.Declaration.heritageClauses != null) {
            this.extends = ApiTypeHelpers.GetHeritageList(
                this.Options,
                this.location,
                this.Declaration.heritageClauses,
                ts.SyntaxKind.ExtendsKeyword
            );
        }

        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }
    }

    public OnExtract(): ApiInterfaceDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKind.Interface,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            Members: this.members,
            Extends: this.extends,
            TypeParameters: this.typeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
