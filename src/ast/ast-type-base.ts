import * as ts from "typescript";
import { AstItemBase, AstItemOptions } from "../abstractions/ast-item-base";
import { AstTypeIdentifiers } from "../contracts/ast-type";
import { AstDeclarationBase } from "./ast-declaration-base";

export abstract class AstTypeBase<TTypeNode extends ts.TypeNode = ts.TypeNode, TExtractedData = {}> extends AstItemBase<
    ts.Type,
    TExtractedData
> {
    constructor(
        options: AstItemOptions,
        item: ts.Type,
        public readonly itemNode: TTypeNode,
        protected readonly identifiers: AstTypeIdentifiers
    ) {
        super(options, item);
    }

    public getParent(): AstDeclarationBase<ts.Declaration, any> | AstTypeBase {
        return this.options.itemsRegistry.get(this.identifiers.parentId) as AstDeclarationBase<ts.Declaration, any> | AstTypeBase;
    }

    public getId(): string {
        const parent = this.getParent();

        // Separate Declaration from types.
        let itemSeparator: string;
        if (parent instanceof AstDeclarationBase) {
            itemSeparator = ":";
        } else {
            itemSeparator = ".";
        }

        const counter: string = this.identifiers.itemCounter != null ? `#${this.identifiers.itemCounter}` : "";

        return `${this.identifiers.parentId}${itemSeparator}${this.itemKind}${counter}`;
    }

    public get text(): string {
        return this.typeChecker.typeToString(this.item);
    }
}
