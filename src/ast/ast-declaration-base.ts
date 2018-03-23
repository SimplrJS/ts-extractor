import * as ts from "typescript";
import { AstItemBase } from "../abstractions/ast-item-base";
import { AstItemBaseDto } from "../contracts/ast-item";

export abstract class AstDeclarationBase<TExtractDto extends AstItemBaseDto, TDeclaration extends ts.Declaration> extends AstItemBase<
    TExtractDto,
    TDeclaration
> {
    public get itemId(): string {
        const counter: string = this.options.itemCounter != null ? `&${this.options.itemCounter}` : "";
        return `${this.parentId}#${this.itemKind}${counter}`;
    }
}
