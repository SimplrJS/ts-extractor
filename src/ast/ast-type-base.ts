import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstItemBase, AstItemOptions, GatheredMembersResult } from "../abstractions/ast-item-base";
import { AstTypeIdentifiers } from "../contracts/ast-type";
import { AstDeclarationBase } from "./ast-declaration-base";

export abstract class AstTypeBase<
    TTypeNode extends ts.TypeNode = ts.TypeNode,
    TGatherResult extends GatheredMembersResult = {},
    TExtractedData = {}
> extends AstItemBase<ts.Type, TGatherResult, TExtractedData> {
    constructor(
        options: AstItemOptions,
        item: ts.Type,
        public readonly itemNode: TTypeNode,
        protected readonly identifiers: AstTypeIdentifiers
    ) {
        super(options, item);
    }

    public getParent(): AstDeclarationBase<ts.Declaration, any, any> | AstTypeBase {
        return this.options.itemsRegistry.get(this.identifiers.parentId) as AstDeclarationBase<ts.Declaration, any, any> | AstTypeBase;
    }

    @LazyGetter()
    public get id(): string {
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

    @LazyGetter()
    public get text(): string {
        return this.typeChecker.typeToString(this.item);
    }
}
