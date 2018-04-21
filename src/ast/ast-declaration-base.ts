import * as ts from "typescript";
import { AstItemBase, AstItemOptions } from "../abstractions/ast-item-base";
import { AstSymbol } from "./ast-symbol";
import { AstDeclarationIdentifiers } from "../contracts/ast-declaration";

export abstract class AstDeclarationBase<TItem extends ts.Declaration, TExtractedData> extends AstItemBase<TItem, TExtractedData> {
    constructor(
        options: AstItemOptions,
        declaration: TItem,
        protected readonly symbol: ts.Symbol,
        protected readonly identifiers: AstDeclarationIdentifiers = {}
    ) {
        super(options, declaration);
    }

    public abstract readonly name: string;

    private parentSymbol: AstSymbol | undefined;

    public getParent(): AstSymbol {
        if (this.parentSymbol == null) {
            const parentSymbolId = this.options.itemsRegistry.getItemId(this.symbol);
            if (parentSymbolId != null) {
                return this.options.itemsRegistry.get(parentSymbolId) as AstSymbol;
            }

            this.parentSymbol = new AstSymbol(this.options, this.symbol);
        }

        return this.parentSymbol;
    }

    public getId(): string {
        const parentId: string = this.identifiers.parentId != null ? this.identifiers.parentId : this.getParent().getId();
        const counter: string = this.identifiers.itemCounter != null ? `#${this.identifiers.itemCounter}` : "";

        return `${parentId}#${this.itemKind}${counter}`;
    }
}
