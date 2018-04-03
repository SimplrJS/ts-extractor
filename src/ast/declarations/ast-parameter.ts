import * as ts from "typescript";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { AstTypeBase } from "../ast-type-base";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";

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

    private typeReference: AstItemMemberReference | undefined;

    public get type(): AstTypeBase<any, any> {
        if (this.typeReference == null) {
            throw new Error(`Failed to resolve parameter reference.`);
        }

        return this.options.itemsRegistry.get(this.typeReference.id) as AstTypeBase<any, any>;
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const type: ts.Type = this.typeChecker.getTypeOfSymbolAtLocation(this.getParent().item, this.item);
        this.typeReference = this.getMemberReferenceFromType(options, type, this.item.type);

        return [this.typeReference];
    }
}
