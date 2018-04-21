import * as ts from "typescript";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";

export class AstNamespace extends AstDeclarationBase<ts.ModuleDeclaration, {}> {
    public get name(): string {
        return this.item.name.getText();
    }

    public readonly itemKind: AstItemKind = AstItemKind.Namespace;

    protected onExtract(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        const sourceFileAstSymbol = this.getParent();

        if (sourceFileAstSymbol == null) {
            this.logger.Error(` Failed to resolve namespace symbol.`);
            return membersReferences;
        }
        if (sourceFileAstSymbol.item.exports == null) {
            return membersReferences;
        }

        sourceFileAstSymbol.item.exports.forEach(symbol => {
            const astSymbol = new AstSymbol(this.options, symbol, { parentId: this.getId() });

            if (!this.options.itemsRegistry.hasItem(symbol)) {
                options.addAstItemToRegistry(astSymbol);
            }

            membersReferences.push({ id: astSymbol.getId() });
        });

        return membersReferences;
    }
}
