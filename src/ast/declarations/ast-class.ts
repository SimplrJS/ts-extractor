import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemKind, AstItemMemberReference, GatheredMembersResult, AstItemGatherMembersOptions } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";

export interface AstClassGatheredResult extends GatheredMembersResult {
    members: AstItemMemberReference[];
}

export class AstClass extends AstDeclarationBase<ts.ClassDeclaration, AstClassGatheredResult, {}> {
    @LazyGetter()
    public get name(): string {
        if (this.item.name != null) {
            return this.item.name.getText();
        }

        // Fallback to a Symbol name.
        return this.parent.name;
    }

    public readonly itemKind: AstItemKind = AstItemKind.Class;

    protected onExtract(): {} {
        return {};
    }

    protected getDefaultGatheredMembers(): AstClassGatheredResult {
        return {
            members: []
        };
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstClassGatheredResult {
        const results: AstClassGatheredResult = {
            members: this.getMemberReferencesFromDeclarationList(options, this.item.members)
        };

        return results;
    }
}