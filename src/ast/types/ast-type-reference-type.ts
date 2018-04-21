import * as ts from "typescript";
import { AstTypeBase } from "../ast-type-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { AstItemGatherMembersOptions, GatheredMembersResult } from "../../abstractions/ast-item-base";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";

export interface AstTypeReferenceTypeGatheredResult extends GatheredMembersResult {
    reference?: AstItemMemberReference;
}

export class AstTypeReferenceType extends AstTypeBase<ts.TypeReferenceType, AstTypeReferenceTypeGatheredResult, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.TypeReferenceType;
    protected onExtract(): {} {
        return {};
    }

    public get reference(): AstSymbol | undefined {
        if (this.gatheredMembers.reference == null) {
            return undefined;
        }

        return this.options.itemsRegistry.get(this.gatheredMembers.reference.id) as AstSymbol;
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstTypeReferenceTypeGatheredResult {
        const result: AstTypeReferenceTypeGatheredResult = {};

        // Resolving symbol
        const parent = this.getParent();
        // Checking if this type is referencing to itself.
        let isSelf: boolean;
        if (parent != null && parent instanceof AstDeclarationBase) {
            const parentSymbol = parent.parent;
            isSelf = this.item.aliasSymbol === parentSymbol.item;
        } else {
            isSelf = false;
        }

        const resolvedSymbol = isSelf ? this.item.getSymbol() : this.item.aliasSymbol || this.item.getSymbol();
        if (resolvedSymbol != null) {
            let astSymbol: AstSymbol;
            if (this.options.itemsRegistry.hasItem(resolvedSymbol)) {
                astSymbol = this.options.itemsRegistry.get(this.options.itemsRegistry.getItemId(resolvedSymbol)!) as AstSymbol;
            } else {
                astSymbol = new AstSymbol(this.options, resolvedSymbol);
                options.addAstItemToRegistry(astSymbol);
            }

            result.reference = {
                id: astSymbol.id
            };
        }

        return result;
    }
}
