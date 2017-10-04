import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiEnumMember } from "./api-enum-member";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiEnumDto } from "../contracts/api-items/api-enum-dto";
import { ApiItemReferenceDict } from "../contracts/api-items/api-item-reference-dict";
import { ApiItemType } from "../contracts/api-items/api-item-type";

export class ApiEnum extends ApiItem<ts.EnumDeclaration, ApiEnumDto> {
    constructor(declaration: ts.EnumDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Members
        this.members = ApiHelpers.GetItemsFromSymbolsIds(symbol.members, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });
    }

    private members: ApiItemReferenceDict = {};

    public Extract(): ApiEnumDto {
        return {
            Type: ApiItemType.Enum,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members
        };
    }
}
