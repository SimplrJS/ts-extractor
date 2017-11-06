import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeLiteralDto } from "../contracts/definitions/api-type-literal-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";

export class ApiTypeLiteral extends ApiItem<ts.TypeLiteralNode, ApiTypeLiteralDto> {
    constructor(declaration: ts.TypeLiteralNode, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        this.members = ApiHelpers.GetItemsIdsFromDeclarations(declaration.members, options);
    }

    private members: ApiItemReferenceDictionary = {};

    public Extract(): ApiTypeLiteralDto {
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
