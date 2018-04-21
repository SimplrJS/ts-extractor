import * as ts from "typescript";
import { AstTypeBase } from "../ast-type-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";

export class AstTypeReferenceType extends AstTypeBase<ts.TypeReferenceType, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.TypeReferenceType;
    protected onExtract(): {} {
        return {};
    }

    private referenceSymbol: AstItemMemberReference | undefined;

    public get reference(): AstSymbol | undefined {
        if (this.referenceSymbol == null) {
            return undefined;
        }

        return this.options.itemsRegistry.get(this.referenceSymbol.id) as AstSymbol;
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const members: AstItemMemberReference[] = [];

        // Resolving symbol
        const parent = this.getParent();
        // Checking if this type is referencing to itself.
        let isSelf: boolean;
        if (parent != null && parent instanceof AstDeclarationBase) {
            const parentSymbol = parent.getParent();
            isSelf = this.item.aliasSymbol === parentSymbol.item;
        } else {
            isSelf = false;
        }

        const resolvedSymbol = isSelf ? this.item.getSymbol() : this.item.aliasSymbol || this.item.getSymbol();
        if (resolvedSymbol != null) {

            let astSymbol: AstSymbol;
            if (this.options.itemsRegistry.hasItem(resolvedSymbol)) {
                astSymbol = this.options.itemsRegistry.get(this.options.itemsRegistry.getItemId(resolvedSymbol)!)! as AstSymbol;
            } else {
                astSymbol = new AstSymbol(this.options, resolvedSymbol);
                options.addAstItemToRegistry(astSymbol);
            }

            this.referenceSymbol = { id: astSymbol.getId() };
            members.push(this.referenceSymbol);
        }

        return members;
    }
}
