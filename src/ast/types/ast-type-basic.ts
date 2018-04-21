import * as ts from "typescript";
import { AstTypeBase } from "../ast-type-base";
import { AstItemKind } from "../../contracts/ast-item";
import { TsHelpers } from "../../ts-helpers";
import { GatheredMembersResult } from "../../abstractions/ast-item-base";

export class AstTypeBasic extends AstTypeBase<ts.TypeNode, GatheredMembersResult, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.TypeBasic;

    protected onExtract(): {} {
        if (TsHelpers.isNodeSynthesized(this.itemNode)) {
            const text = ts.tokenToString(this.itemNode.kind);
            if (text != null) {
                return text;
            }
        }

        return this.typeChecker.typeToString(this.item);
    }

    protected gatheredMembers: GatheredMembersResult = {};

    protected onGatherMembers(): GatheredMembersResult {
        return {};
    }
}
