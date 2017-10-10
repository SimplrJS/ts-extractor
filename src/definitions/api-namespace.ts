import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiNamespaceDto } from "../contracts/definitions/api-namespace-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";

export class ApiNamespace extends ApiItem<ts.ModuleDeclaration, ApiNamespaceDto> {
    constructor(declaration: ts.ModuleDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        if (symbol.exports == null) {
            return;
        }

        // Members
        this.members = ApiHelpers.GetItemsFromSymbolsIds(symbol.exports, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program,
            ProjectDirectory: this.ProjectDirectory
        });
    }

    private members: ApiItemReferenceDict = {};

    public Extract(): ApiNamespaceDto {
        return {
            ApiKind: ApiItemKinds.Namespace,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members
        };
    }

}
