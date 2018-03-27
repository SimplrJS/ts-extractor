import * as ts from "typescript";
import { AstTypeBase, AstTypeBaseDto } from "../ast-type-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { TsHelpers } from "../../ts-helpers";

export interface AstTypeBasicDto extends AstTypeBaseDto {
    text: string;
}

export class AstTypeBasic extends AstTypeBase<AstTypeBasicDto, ts.TypeNode> {
    public get itemKind(): string {
        return AstItemKind.TypeBasic;
    }

    public get name(): string {
        return ts.InternalSymbolName.Type;
    }

    public get text(): string {
        if (TsHelpers.IsNodeSynthesized(this.itemNode)) {
            const text = ts.tokenToString(this.itemNode.kind);
            if (text != null) {
                return text;
            }
        }

        return this.typeChecker.typeToString(this.item);
    }

    protected onExtract(): AstTypeBasicDto {
        return {
            name: this.name,
            text: this.text
        };
    }

    protected onGatherMembers(): AstItemMemberReference[] {
        return [];
    }
}
