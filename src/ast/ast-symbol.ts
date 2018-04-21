import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstItemBase, AstItemGatherMembersOptions, AstItemOptions } from "../abstractions/ast-item-base";
import { AstItemMemberReference, AstItemKind } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";

export interface AstSymbolIdentifiers {
    parentId?: string;
}

export class AstSymbol extends AstItemBase<ts.Symbol, {}, {}> {
    constructor(options: AstItemOptions, symbol: ts.Symbol, private readonly identifiers: AstSymbolIdentifiers = {}) {
        super(options, symbol);
    }

    public readonly itemKind: AstItemKind = AstItemKind.Symbol;

    @LazyGetter()
    public get name(): string {
        return TsHelpers.resolveSymbolName(this.item);
    }

    /**
     * Returns initialized AstDeclaration instance.
     */
    private getFirstAstDeclaration(): AstItemBase<ts.Declaration, any, any> | undefined {
        if (this.item.declarations == null || this.item.declarations.length === 0) {
            return undefined;
        }
        const declaration = this.item.declarations[0];
        return this.options.resolveAstDeclaration(declaration, this.item);
    }

    @LazyGetter()
    private get parent(): AstItemBase<any, any, any> | undefined {
        if (this.identifiers.parentId != null && this.options.itemsRegistry.has(this.identifiers.parentId)) {
            return this.options.itemsRegistry.get(this.identifiers.parentId);
        }

        const firstAstDeclaration = this.getFirstAstDeclaration();
        if (firstAstDeclaration == null) {
            return undefined;
        }

        const parentDeclaration = firstAstDeclaration.item.parent as ts.Declaration | undefined;
        if (parentDeclaration == null) {
            return undefined;
        }

        const parentSymbol = TsHelpers.getSymbolFromDeclaration(parentDeclaration, this.typeChecker);
        if (parentSymbol == null) {
            return undefined;
        }

        return this.options.resolveAstDeclaration(parentDeclaration, parentSymbol);
    }

    @LazyGetter()
    public get parentId(): string | undefined {
        if (this.identifiers.parentId != null) {
            return this.identifiers.parentId;
        }

        const resolvedParentAstDeclaration = this.parent;
        if (resolvedParentAstDeclaration == null) {
            return undefined;
        }

        return resolvedParentAstDeclaration.id;
    }

    @LazyGetter()
    public get id(): string {
        if (this.parent == null) {
            return "???";
        }

        // Separate SourceFile from other items.
        let itemSeparator: string;
        if (this.parent.itemKind === AstItemKind.SourceFile) {
            itemSeparator = ":";
        } else {
            itemSeparator = ".";
        }

        return `${this.parentId}${itemSeparator}${this.name}`;
    }

    protected onExtract(): {} {
        return {};
    }

    // TODO: Refactor code.
    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        if (this.item.declarations == null) {
            this.logger.Error(`[${this.id}] Symbol declarations list is undefined.`);
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
            membersReferences.push({ id: astItem.id });

            if (sameKind) {
                counter++;
            }
        }

        return membersReferences;
    }
}
