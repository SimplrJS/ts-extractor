import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiNamespaceDto } from "../contracts/api-definitions";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiDefinitionKind } from "../contracts/api-item-kind";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiNamespace extends ApiItem<ts.ModuleDeclaration | ts.NamespaceImport, ApiNamespaceDto> {
    private location: ApiItemLocationDto;
    private members: ApiItemReference[] = [];

    protected ResolveApiKind(): ApiDefinitionKind.Namespace | ApiDefinitionKind.ImportNamespace {
        if (ts.isModuleDeclaration(this.Declaration)) {
            return ApiDefinitionKind.Namespace;
        } else {
            return ApiDefinitionKind.ImportNamespace;
        }
    }

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Members
        this.members = ApiHelpers.GetItemsIdsFromSymbolsMap(this.Symbol.exports, this.Options);
    }

    public OnExtract(): ApiNamespaceDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const apiKind = this.ResolveApiKind();

        return {
            ApiKind: apiKind,
            Name: this.Declaration.name.getText(),
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            Members: this.members,
            _ts: this.GetTsDebugInfo()
        };
    }

}
