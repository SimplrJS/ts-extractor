import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemGatherMembersOptions, GatheredMembersResult } from "../../abstractions/ast-item-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";

export interface AstNamespaceGatheredResult extends GatheredMembersResult {
    members: AstItemMemberReference[];
}

export class AstNamespace extends AstDeclarationBase<ts.ModuleDeclaration, AstNamespaceGatheredResult, {}> {
    @LazyGetter()
    public get name(): string {
        return this.item.name.getText();
    }

    public readonly itemKind: AstItemKind = AstItemKind.Namespace;

    protected onExtract(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstNamespaceGatheredResult {
        const results: AstNamespaceGatheredResult = {
            members: []
        };
        if (this.parent == null) {
            this.logger.Error(`____ Failed to resolve namespace symbol.`);
            return results;
        }
        if (this.parent.item.exports == null) {
            return results;
        }

        this.parent.item.exports.forEach(symbol => {
            const astSymbol = new AstSymbol(this.options, symbol, { parentId: this.id });

            if (!this.options.itemsRegistry.hasItem(symbol)) {
                options.addAstItemToRegistry(astSymbol);
            }

            results.members.push({ id: astSymbol.id });
        });

        return results;
    }
}
