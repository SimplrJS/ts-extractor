import * as ts from "typescript";
import { AstItemBase } from "../abstractions/ast-item-base";
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

    private _name: string | undefined;

    public get name(): string {
        if (this._name == null) {
            // Resolve name from Declarations.
            if (this.item.declarations != null) {
                for (const declaration of this.item.declarations) {
                    const namedDeclaration: ts.NamedDeclaration = declaration;

                    if (namedDeclaration.name != null) {
                        this._name = namedDeclaration.name.getText();
                        return this._name;
                    }
                }
            }

            // Fallback to a Symbol name.
            this._name = this.item.name;
        }

        return this._name;
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
