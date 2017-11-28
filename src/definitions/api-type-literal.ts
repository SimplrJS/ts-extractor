import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";

import { ApiTypeLiteralDto } from "../contracts/definitions/api-type-literal-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiTypeLiteral extends ApiItem<ts.TypeLiteralNode, ApiTypeLiteralDto> {
    private members: ApiItemReferenceTuple = [];

    protected OnGatherData(): void {
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);
    }

    public OnExtract(): ApiTypeLiteralDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.TypeLiteral,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Members: this.members
        };
    }
}
