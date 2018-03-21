import * as ts from "typescript";
import { AstItemBase } from "../abstractions/ast-item-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../contracts/ast-item";

export interface AstVariableDto extends AstItemBaseDto {
    type: any;
}

export class AstVariable extends AstItemBase<AstVariableDto, ts.VariableDeclaration> {
    public get itemKind(): AstItemKind {
        return AstItemKind.Variable;
    }

    public get name(): string {
        return this.item.name.getText();
    }

    protected onExtract(): AstVariableDto {
        return {
            name: this.name,
            type: {}
        };
    }

    protected onGatherMembers(): AstItemMemberReference[] {
        return [];
    }
}
