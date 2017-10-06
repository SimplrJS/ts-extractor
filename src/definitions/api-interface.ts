import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiInterfaceDto } from "../contracts/definitions/api-interface-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

export class ApiInterface extends ApiItem<ts.InterfaceDeclaration, ApiInterfaceDto> {
    constructor(declaration: ts.InterfaceDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Members
        this.members = ApiHelpers.GetItemsFromDeclarationsIds(declaration.members, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });

        // Extends
        if (declaration.heritageClauses != null) {
            this.extends = ApiHelpers.GetHeritageList(declaration.heritageClauses, ts.SyntaxKind.ExtendsKeyword, {
                ItemsRegistry: this.ItemsRegistry,
                Program: this.Program
            });
        }
    }

    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: ApiTypeDto[] = [];
    private members: ApiItemReferenceDict = {};

    public Extract(): ApiInterfaceDto {
        return {
            ApiKind: ApiItemKinds.Interface,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members,
            Extends: this.extends
        };
    }
}
