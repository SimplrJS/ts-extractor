import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstTypeBase, AstTypeBaseDto } from "../ast-type-base";
import { AstItemKind, GatheredMembersResult } from "../../contracts/ast-item";
import { TsHelpers } from "../../ts-helpers";

export class AstTypeBasic extends AstTypeBase<ts.TypeNode, {}, AstTypeBaseDto> {
    public readonly itemKind: AstItemKind = AstItemKind.TypeBasic;

    @LazyGetter()
    public get text(): string {
        if (TsHelpers.isNodeSynthesized(this.itemNode)) {
            const text = ts.tokenToString(this.itemNode.kind);
            if (text != null) {
                return text;
            }
        }

        return this.typeChecker.typeToString(this.item);
    }

    protected onExtract(): AstTypeBaseDto {
        return {
            kind: this.itemKind,
            text: this.text
        };
    }

    protected getDefaultGatheredMembers(): {} {
        return {};
    }

    protected onGatherMembers(): GatheredMembersResult {
        return {};
    }
}
