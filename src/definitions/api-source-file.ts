import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFileDto } from "../contracts/definitions/api-source-file-dto";
import { ApiItemTypes } from "../contracts/api-item-types";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiVariable } from "./api-variable";

export class ApiSourceFile extends ApiItem<ts.SourceFile, ApiSourceFileDto> {
    constructor(sourceFile: ts.SourceFile, options: ApiItemOptions) {
        const symbol = TSHelpers.GetSymbolFromDeclaration(sourceFile, options.Program.getTypeChecker());
        if (symbol == null || symbol.exports == null) {
            throw Error("Should not happen");
        }

        super(sourceFile, symbol, options);

        this.members = ApiHelpers.GetItemsFromSymbolsIds(symbol.exports, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });
    }

    private members: ApiItemReferenceDict;

    public Extract(): ApiSourceFileDto {
        return {
            ApiType: ApiItemTypes.SourceFile,
            Name: this.Declaration.fileName,
            FileName: this.Declaration.fileName,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members
        };
    }
}
