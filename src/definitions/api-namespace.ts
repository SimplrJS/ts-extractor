import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiNamespaceDto } from "../contracts/definitions/api-namespace-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiNamespace extends ApiItem<ts.ModuleDeclaration | ts.NamespaceImport, ApiNamespaceDto> {
    private members: ApiItemReference[] = [];

    protected OnGatherData(): void {
        // Members
        this.members = ApiHelpers.GetItemsIdsFromSymbolsMap(this.Symbol.exports, this.Options);
    }

    public OnExtract(): ApiNamespaceDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Namespace,
            Name: this.Declaration.name.getText(),
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Members: this.members
        };
    }

}
