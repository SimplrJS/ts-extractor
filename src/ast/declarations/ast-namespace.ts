import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase, AstDeclarationBaseDto } from "../ast-declaration-base";
import {
    AstItemKind,
    GatheredMember,
    GatheredMembersResult,
    AstItemGatherMembersOptions,
    GatheredMemberReference
} from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";

export interface AstNamespaceGatheredResult extends GatheredMembersResult {
    members: Array<GatheredMember<AstSymbol>>;
}

export interface AstNamespaceDto extends AstDeclarationBaseDto {
    kind: AstItemKind.Namespace;
    members: GatheredMemberReference[];
}

export class AstNamespace extends AstDeclarationBase<ts.ModuleDeclaration, AstNamespaceGatheredResult, AstNamespaceDto> {
    @LazyGetter()
    public get name(): string {
        return this.item.name.getText();
    }

    public readonly itemKind: AstItemKind.Namespace = AstItemKind.Namespace;

    protected onExtract(): AstNamespaceDto {
        const members = this.gatheredMembers.members.map<GatheredMemberReference>(x => ({ id: x.item.id, alias: x.alias }));

        return {
            kind: this.itemKind,
            name: this.name,
            members: members
        };
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
