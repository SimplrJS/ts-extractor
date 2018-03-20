import * as ts from "typescript";
import { AstItemBase } from "../abstractions/api-item-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../contracts/ast-item";

export interface AstSymbolDto extends AstItemBaseDto {
    members: AstItemMemberReference[];
}

export class AstSymbol extends AstItemBase<AstSymbolDto, ts.Symbol> {
    public get itemKind(): AstItemKind {
        return AstItemKind.Symbol;
    }

    public get itemId(): string {
        // Separate SourceFile from other items.
        let itemSeparator: string;
        const parentItem = this.options.itemsRegistry.get(this.options.parentId);
        if (parentItem != null && parentItem.itemKind === AstItemKind.SourceFile) {
            itemSeparator = ":";
        } else {
            itemSeparator = ".";
        }

        return `${this.parentId}${itemSeparator}${this.name}`;
    }

    public get name(): string {
        return this.item.name;
    }

    protected onExtract(): AstSymbolDto {
        return {
            name: this.name,
            members: this.membersReferences || []
        };
    }

    protected onGatherMembers(): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        if (this.item.declarations == null) {
            this.logger.Error(`[${this.itemId}] Symbol declarations list is undefined.`);
            return membersReferences;
        }

        for (const declaration of this.item.declarations) {
            const astItem = this.options.resolveDeclaration(
                {
                    ...this.options,
                    parentId: this.itemId
                },
                declaration
            );

            if (astItem == null) {
                continue;
            }

            if (!this.options.itemsRegistry.has(astItem.itemId)) {
                this.options.addItemToRegistry(astItem);
            }
            membersReferences.push({ alias: astItem.name, id: astItem.itemId });
        }

        return membersReferences;
    }
}
