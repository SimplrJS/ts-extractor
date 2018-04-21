import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";

export class AstNamespace extends AstDeclarationBase<ts.ModuleDeclaration, {}> {
    @LazyGetter()
    public get name(): string {
        return this.item.name.getText();
    }

    public readonly itemKind: AstItemKind = AstItemKind.Namespace;

    protected onExtract(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        if (this.parent == null) {
            this.logger.Error(`____ Failed to resolve namespace symbol.`);
            return membersReferences;
        }
        if (this.parent.item.exports == null) {
            return membersReferences;
        }

        this.parent.item.exports.forEach(symbol => {
            const astSymbol = new AstSymbol(this.options, symbol, { parentId: this.id });

            if (!this.options.itemsRegistry.hasItem(symbol)) {
                options.addAstItemToRegistry(astSymbol);
            }

            membersReferences.push({ id: astSymbol.id });
        });

        return membersReferences;
    }
}
