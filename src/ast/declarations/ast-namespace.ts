import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemKind, GatheredMemberMetadata, GatheredMembersResult, AstItemGatherMembersOptions } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";

export interface AstNamespaceGatheredResult extends GatheredMembersResult {
    members: Array<GatheredMemberMetadata<AstSymbol>>;
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
            members: this.getMembersFromSymbolList(options, this.symbol.exports)
        };

        return results;
    }
}
