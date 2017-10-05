import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiInterfaceDto } from "../contracts/api-items/api-interface-dto";
import { ApiItemReferenceDict } from "../contracts/api-items/api-item-reference-dict";
import { ApiItemType } from "../contracts/api-items/api-item-type";

import { ApiProperty } from "./api-property";
import { ApiMethod } from "./api-method";

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
            this.extends = TSHelpers.GetHeritageList(declaration.heritageClauses, ts.SyntaxKind.ExtendsKeyword, this.TypeChecker);
        }
    }

    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: string[] = [];
    private members: ApiItemReferenceDict = {};

    public Extract(): ApiInterfaceDto {
        return {
            ApiType: ApiItemType.Interface,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members,
            Extends: this.extends
        };
    }
}
