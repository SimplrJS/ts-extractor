import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiNamespaceDto } from "../contracts/api-items/api-namespace-dto";
import { ApiItemReferenceDict } from "../contracts/api-items/api-item-reference-dict";
import { ApiItemType } from "../contracts/api-items/api-item-type";

export class ApiNamespace extends ApiItem<ts.ModuleDeclaration, ApiNamespaceDto> {
    constructor(declaration: ts.ModuleDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        if (symbol.exports == null) {
            return;
        }

        // Members
        this.members = ApiHelpers.GetItemsFromSymbolsIds(symbol.exports, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });
    }

    private members: ApiItemReferenceDict = {};

    public Extract(): ApiNamespaceDto {
        return {
            Type: ApiItemType.Namespace,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members
        };
    }

}
