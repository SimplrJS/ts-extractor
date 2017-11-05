import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiNamespaceDto } from "../contracts/definitions/api-namespace-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiNamespace extends ApiItem<ts.ModuleDeclaration, ApiNamespaceDto> {
    constructor(declaration: ts.ModuleDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        if (symbol.exports == null) {
            return;
        }

        // Members
        this.members = ApiHelpers.GetItemsIdsFromSymbols(symbol.exports, this.Options);
    }

    private members: ApiItemReferenceDictionary = {};

    public Extract(): ApiNamespaceDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Namespace,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Members: this.members
        };
    }

}
