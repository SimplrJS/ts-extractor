import * as ts from "typescript";
import { AstItemBase, AstItemGatherMembersOptions, AstItemOptions } from "../abstractions/ast-item-base";
import { AstItemMemberReference, AstItemKind } from "../contracts/ast-item";
import { AstDeclarations } from "./ast-declarations";
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

        if (this.options.itemsRegistry.hasItem(declaration)) {
            return this.options.itemsRegistry.get(this.options.itemsRegistry.getItemId(declaration)!)!;
        }
        const astDeclarationConstructor = AstDeclarations.get(declaration.kind);
        if (astDeclarationConstructor == null) {
            throw new Error("____ Not supported declaration kind.");
        }

        return new astDeclarationConstructor(this.options, declaration);
    }

    public getParentId(): string | undefined {
        if (this.parentId == null) {
            // Resolve parent id from declarations list.
            const astDeclaration = this.getFirstAstDeclaration();
            if (ts.isSourceFile(astDeclaration.item)) {
                return undefined;
            }

            this.parentId = astDeclaration.getParentId();
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

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        if (this.item.declarations == null) {
            this.logger.Error(`[${this.getId}] Symbol declarations list is undefined.`);
            return membersReferences;
        }

        for (const declaration of this.item.declarations) {
            const astItem = options.resolveAstDeclaration(declaration);
            if (astItem == null) {
                continue;
            }

            if (!this.options.itemsRegistry.hasItem(declaration)) {
                options.addAstItemToRegistry(astItem);
            }
            membersReferences.push({ id: astItem.getId() });
        }

        return membersReferences;
    }
}
