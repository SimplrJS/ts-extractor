import * as ts from "typescript";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";

export class AstDeclarationNotSupported extends AstDeclarationBase<ts.Declaration | ts.NamedDeclaration, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.DeclarationNotSupported;

    private isNamedDeclaration(declaration: ts.Declaration | ts.NamedDeclaration): declaration is ts.NamedDeclaration {
        return (declaration as ts.NamedDeclaration).name != null;
    }

    public get name(): string {
        if (this.isNamedDeclaration(this.item) && this.item.name != null) {
            return this.item.name.getText();
        }

        return this.parent.name;
    }

    protected onExtract(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        return [];
    }
}
