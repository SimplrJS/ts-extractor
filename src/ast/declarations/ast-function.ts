import * as ts from "typescript";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";

export interface AstFunctionDto extends AstItemBaseDto {
    returnType: any;
}

export class AstFunction extends AstDeclarationBase<AstFunctionDto, ts.FunctionDeclaration> {
    public get itemKind(): AstItemKind {
        return AstItemKind.Function;
    }

    public get name(): string {
        if (this.item.name == null) {
            return "???";
        }

        return this.item.name.getText();
    }

    protected onExtract(): AstFunctionDto {
        return {
            name: this.name,
            returnType: {}
        };
    }

    public get parameters(): AstSymbol[] {
        return this.parametersReferences.map(x => this.options.itemsRegistry.get(x.id)) as AstSymbol[];
    }

    private parametersReferences: AstItemMemberReference[] = [];

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        this.parametersReferences = this.getMemberReferencesFromDeclarationList(options, this.item.parameters);

        return [
            ...this.parametersReferences
        ];
    }
}
