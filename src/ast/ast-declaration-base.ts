import * as ts from "typescript";
import { AstItemBase } from "../abstractions/ast-item-base";
import { AstSymbol } from "./ast-symbol";
import { TsHelpers } from "../ts-helpers";

export abstract class AstDeclarationBase<TItem extends ts.Declaration, TExtractedData> extends AstItemBase<TItem, TExtractedData> {
    public abstract readonly name: string;

    private parentSymbol: AstSymbol | undefined;
    public getParent(): AstSymbol {
        if (this.parentSymbol == null) {
            const parentSymbol = TsHelpers.GetSymbolFromDeclaration(this.item, this.typeChecker);
            if (parentSymbol == null) {
                throw new Error("Declaration doesn't have symbol.");
            }

            const parentSymbolId = this.options.itemsRegistry.getItemId(parentSymbol);
            if (parentSymbolId != null) {
                return this.options.itemsRegistry.get(parentSymbolId) as AstSymbol;
            }

            this.parentSymbol = new AstSymbol(this.options, parentSymbol);
        }

        return this.parentSymbol;
    }

    public getId(): string {
        return `${this.getParent().getId()}#${this.itemKind}`;
    }
}
