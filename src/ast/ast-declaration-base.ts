import * as ts from "typescript";
import { AstItemBase } from "../abstractions/ast-item-base";
import { AstDeclarations } from "./ast-declarations";
import { AstSymbol } from "./ast-symbol";
import { TsHelpers } from "../ts-helpers";

export abstract class AstDeclarationBase<TItem extends ts.Declaration, TExtractedData> extends AstItemBase<TItem, TExtractedData> {
    public getParentId(): string | undefined {
        if (this.item.parent == null) {
            return undefined;
        }

        const parentDeclaration = this.item.parent as ts.Declaration;
        const parentId = this.options.itemsRegistry.getItemId(parentDeclaration);
        if (parentId != null) {
            return parentId;
        }

        const astDeclarationConstructor = AstDeclarations.get(parentDeclaration.kind);
        if (astDeclarationConstructor == null) {
            return undefined;
        }

        const parentAstDeclaration = new astDeclarationConstructor(this.options, parentDeclaration);

        return parentAstDeclaration.getId();
    }

    public getParent(): AstSymbol | undefined {
        const parentId = this.getParentId();
        if (parentId != null) {
            return this.options.itemsRegistry.get(parentId) as AstSymbol | undefined;
        }

        const parentSymbol = TsHelpers.GetSymbolFromDeclaration(this.item, this.typeChecker);
        if (parentSymbol == null) {
            return undefined;
        }

        return new AstSymbol(this.options, parentSymbol);
    }

    public getId(): string {
        return `${this.getParentId()}#${this.itemKind}`;
    }
}
