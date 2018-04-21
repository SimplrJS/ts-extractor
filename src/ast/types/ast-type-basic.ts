import * as ts from "typescript";
import { AstTypeBase } from "../ast-type-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { TsHelpers } from "../../ts-helpers";

export class AstTypeBasic extends AstTypeBase<ts.TypeNode, {}, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.TypeBasic;

    protected onExtract(): {} {
        if (TsHelpers.IsNodeSynthesized(this.itemNode)) {
            const text = ts.tokenToString(this.itemNode.kind);
            if (text != null) {
                return text;
            }
        }

        return this.typeChecker.typeToString(this.item);
    }

    protected onGatherMembers(): AstItemMemberReference[] {
        return [];
    }
}
