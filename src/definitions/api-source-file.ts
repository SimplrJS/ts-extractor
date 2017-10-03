import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiVariable } from "./api-variable";

export class ApiSourceFile extends ApiItem<ts.SourceFile> {
    constructor(sourceFile: ts.SourceFile, options: ApiItemOptions) {
        const symbol = TSHelpers.GetSymbolFromDeclaration(sourceFile, options.Program.getTypeChecker());
        if (symbol == null || symbol.exports == null) {
            throw Error("Should not happen");
        }

        super(sourceFile, symbol, options);

        this.members = ApiHelpers.GetExportedItemsIds(symbol.exports, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program
        });
    }

    private members: string[];

    public ToJson(): { [key: string]: any; } {
        return {
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            FileName: this.Declaration.getSourceFile().fileName,
            Members: this.members
        };
    }
}
