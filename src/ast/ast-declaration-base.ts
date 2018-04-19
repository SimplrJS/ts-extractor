import * as ts from "typescript";
import { AstItemBase } from "../abstractions/ast-item-base";
import { AstDeclarations } from "./ast-declarations";

export abstract class AstDeclarationBase<TItem extends ts.Declaration, TExtractedData> extends AstItemBase<TItem, TExtractedData> {
    public getParentId(): string | undefined {
        if (this.item.parent == null) {
            throw new Error("___ Parent not found!");
        }
        const parentDeclaration = this.item.parent as ts.Declaration;
        const parentId = this.options.itemsRegistry.getItemId(parentDeclaration);
        if (parentId != null) {
            return parentId;
        }

        const astDeclarationConstructor = AstDeclarations.get(parentDeclaration.kind);
        if (astDeclarationConstructor == null) {
            throw new Error("___ Not supported item.");
        }

        const parentAstDeclaration = new astDeclarationConstructor(this.options, parentDeclaration);

        return parentAstDeclaration.getId();
    }

    public getId(): string {
        return `${this.getParentId()}#${this.itemKind}`;
    }
}
