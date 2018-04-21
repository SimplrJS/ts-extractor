import * as ts from "typescript";
import { AstItemBase, AstItemGatherMembersOptions, AstItemOptions } from "../abstractions/ast-item-base";
import { AstItemMemberReference, AstItemKind } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";

export class AstSymbol extends AstItemBase<ts.Symbol, {}> {
    constructor(options: AstItemOptions, symbol: ts.Symbol, private parentId?: string) {
        super(options, symbol);
    }

    public getName(): string {
        return TsHelpers.resolveSymbolName(this.item);
    }

    public readonly itemKind: AstItemKind = AstItemKind.Symbol;

    /**
     * Returns initialized AstDeclaration instance.
     */
    private getFirstAstDeclaration(): AstItemBase<ts.Declaration, {}> {
        if (this.item.declarations == null || this.item.declarations.length === 0) {
            throw new Error("____ Symbol does not have declarations.`");
        }
        const declaration = this.item.declarations[0];
        const astDeclaration = this.options.resolveAstDeclaration(declaration, this.item);
        if (astDeclaration == null) {
            throw new Error("____ Not supported kind declaration.");
        }

        return astDeclaration;
    }

    public getParentId(): string | undefined {
        if (this.parentId == null) {
            // Resolve parent id from declarations list.
            const astDeclaration = this.getFirstAstDeclaration();
            if (astDeclaration.item.parent == null) {
                return undefined;
            }
            const parentDeclaration = astDeclaration.item.parent as ts.Declaration;
            const parentSymbol = TsHelpers.GetSymbolFromDeclaration(parentDeclaration, this.typeChecker);
            if (parentSymbol == null) {
                this.logger.Error("___ Failed to resolve parent symbol.");
                return undefined;
            }

            const parentAstDeclaration = this.options.resolveAstDeclaration(parentDeclaration, parentSymbol);
            if (parentAstDeclaration == null) {
                return undefined;
            }

            this.parentId = parentAstDeclaration.getId();
        }

        return this.parentId;
    }

    public getId(): string {
        const parentId = this.getParentId();
        if (parentId == null) {
            throw new Error("____ SourceFile Symbol?");
        }

        // Separate SourceFile from other items.
        let itemSeparator: string;
        const parentItem = this.options.itemsRegistry.get(parentId);
        if (parentItem != null && parentItem.itemKind === AstItemKind.SourceFile) {
            itemSeparator = ":";
        } else {
            itemSeparator = ".";
        }

        return `${this.parentId}${itemSeparator}${this.getName()}`;
    }

    protected onExtract(): {} {
        return {};
    }

    // TODO: Refactor code.
    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        if (this.item.declarations == null) {
            this.logger.Error(`[${this.getId}] Symbol declarations list is undefined.`);
            return membersReferences;
        }

        let counter: number = 0;
        for (const declaration of this.item.declarations) {
            const sameKind = this.item.declarations.findIndex(x => x.kind === declaration.kind && x !== declaration) !== -1;

            const astItem = this.options.resolveAstDeclaration(declaration, this.item, { itemCounter: sameKind ? counter : undefined });
            if (astItem == null) {
                continue;
            }

            if (!this.options.itemsRegistry.hasItem(declaration)) {
                options.addAstItemToRegistry(astItem);
            }
            membersReferences.push({ id: astItem.getId() });

            if (sameKind) {
                counter++;
            }
        }

        return membersReferences;
    }
}
