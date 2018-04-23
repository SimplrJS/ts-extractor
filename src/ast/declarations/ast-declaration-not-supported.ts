import * as ts from "typescript";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemKind, AstItemGatherMembersOptions, GatheredMembersResult } from "../../contracts/ast-item";

export class AstDeclarationNotSupported extends AstDeclarationBase<ts.Declaration | ts.NamedDeclaration, {}, {}> {
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

    protected getDefaultGatheredMembers(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): GatheredMembersResult {
        return {};
    }
}
