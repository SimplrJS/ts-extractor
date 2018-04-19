import * as ts from "typescript";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";

export class AstNamespace extends AstDeclarationBase<ts.ModuleDeclaration, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.Namespace;

    protected onExtract(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const results: AstItemMemberReference[] = [];

        return results;
    }
}
