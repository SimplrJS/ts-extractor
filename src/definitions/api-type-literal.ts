import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeLiteralDto } from "../contracts/definitions/api-type-literal-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";

export class ApiTypeLiteral extends ApiItem<ts.TypeLiteralNode, ApiTypeLiteralDto> {
    private members: ApiItemReferenceTuple = [];

    protected OnGatherData(): void {
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.members, this.Options);
    }

    public OnExtract(): ApiTypeLiteralDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.TypeLiteral,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Members: this.members
        };
    }
}
