import * as ts from "typescript";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";
// import { TsHelpers } from "../../ts-helpers";

export class AstFunction extends AstDeclarationBase<ts.FunctionDeclaration, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.Function;

    public get name(): string {
        if (this.item.name == null) {
            return "???";
        }

        return this.item.name.getText();
    }

    protected onExtract(): {} {
        return {};
    }

    public get parameters(): AstSymbol[] {
        return this.parametersReferences.map(x => this.options.itemsRegistry.get(x.id)) as AstSymbol[];
    }

    private parametersReferences: AstItemMemberReference[] = [];

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        return [];
    }
}
