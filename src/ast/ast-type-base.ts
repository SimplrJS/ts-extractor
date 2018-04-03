import * as ts from "typescript";
import { AstItemBase, AstItemOptions } from "../abstractions/ast-item-base";
import { AstItemBaseDto } from "../contracts/ast-item";

export interface AstTypeBaseDto extends AstItemBaseDto {
    text: string;
}

export abstract class AstTypeBase<TExtractDto extends AstTypeBaseDto, TTypeNode extends ts.TypeNode> extends AstItemBase<
    TExtractDto,
    ts.Type
> {
    constructor(options: AstItemOptions, item: ts.Type, public readonly itemNode: TTypeNode) {
        super(options, item);
    }

    public get text(): string {
        return this.typeChecker.typeToString(this.item);
    }

    public get itemId(): string {
        const counter: string = this.options.itemCounter != null ? `&${this.options.itemCounter}` : "";
        return `${this.parentId}#${this.itemKind}${counter}`;
    }
}
