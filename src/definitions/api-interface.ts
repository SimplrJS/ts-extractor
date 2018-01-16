import * as ts from "typescript";

import { ApiItem } from "../abstractions/api-item";
import { ApiHelpers } from "../api-helpers";
import { ApiInterfaceDto } from "../contracts/definitions/api-interface-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiType } from "../contracts/api-type";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiInterface extends ApiItem<ts.InterfaceDeclaration, ApiInterfaceDto> {
    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: ApiType[] = [];
    private typeParameters: ApiItemReference[] = [];
    private members: ApiItemReference[] = [];

    protected OnGatherData(): void {
        // Members
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);

        // Extends
        if (this.Declaration.heritageClauses != null) {
            this.extends = ApiTypeHelpers.GetHeritageList(this.Declaration.heritageClauses, ts.SyntaxKind.ExtendsKeyword, this.Options);
        }

        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }
    }

    public OnExtract(): ApiInterfaceDto {
        const parentId: string | undefined = this.GetParentId();
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Interface,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: location,
            Members: this.members,
            Extends: this.extends,
            TypeParameters: this.typeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
