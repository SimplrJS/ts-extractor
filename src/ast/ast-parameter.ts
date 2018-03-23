import * as ts from "typescript";
import { AstDeclarationBase } from "./ast-declaration-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../contracts/ast-item";

export interface AstParameterDto extends AstItemBaseDto {
    type: any;
}

export class AstParameter extends AstDeclarationBase<AstParameterDto, ts.ParameterDeclaration> {
    public get itemKind(): AstItemKind {
        return AstItemKind.Parameter;
    }

    public get name(): string {
        return this.item.name.getText();
    }

    protected onExtract(): AstParameterDto {
        return {
            name: this.name,
            type: {}
        };
    }

    protected onGatherMembers(): AstItemMemberReference[] {
        return [];
    }
}
