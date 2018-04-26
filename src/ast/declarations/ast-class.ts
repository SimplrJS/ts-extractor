import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemKind, GatheredMember, GatheredMembersResult, AstItemGatherMembersOptions } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";
import { AstType } from "../ast-type-base";

export interface AstClassGatheredResult extends GatheredMembersResult {
    members: Array<GatheredMember<AstSymbol>>;
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
            members: this.getMembersFromDeclarationList(options, this.item.members)
        };

        return results;
    }
}
