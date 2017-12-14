import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiNamespaceDto } from "../contracts/definitions/api-namespace-dto";
import { ApiItemReferenceTuplesList } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiNamespace extends ApiItem<ts.ModuleDeclaration, ApiNamespaceDto> {
    private members: ApiItemReferenceTuplesList = [];

    protected OnGatherData(): void {
        // Members
        this.members = ApiHelpers.GetItemsIdsFromSymbols(this.Symbol.exports, this.Options);
    }

    public OnExtract(): ApiNamespaceDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Namespace,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Members: this.members
        };
    }

}
