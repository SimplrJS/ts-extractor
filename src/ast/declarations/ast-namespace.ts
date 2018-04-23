import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemKind, AstItemMemberReference, GatheredMembersResult, AstItemGatherMembersOptions } from "../../contracts/ast-item";
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

    protected getDefaultGatheredMembers(): AstNamespaceGatheredResult {
        return {
            members: []
        };
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstNamespaceGatheredResult {
        const results: AstNamespaceGatheredResult = {
            members: []
        };
        if (this.symbol.exports == null) {
            return results;
        }

        this.symbol.exports.forEach(symbol => {
            const astSymbol = new AstSymbol(this.options, symbol, { parentId: this.id });

            if (!this.options.itemsRegistry.hasItem(symbol)) {
                options.addAstItemToRegistry(astSymbol);
            }

            results.members.push({ id: astSymbol.id });
        });

        return results;
    }
}
