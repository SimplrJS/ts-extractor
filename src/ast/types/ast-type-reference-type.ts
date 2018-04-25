import * as ts from "typescript";

import { AstTypeBase } from "../ast-type-base";
import { AstItemKind, GatheredMembersResult, AstItemGatherMembersOptions, GatheredMemberMetadata } from "../../contracts/ast-item";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";

export interface AstTypeReferenceTypeGatheredResult extends GatheredMembersResult {
    reference?: GatheredMemberMetadata<AstSymbol>;
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

        return this.gatheredMembers.reference.item;
    }

    protected getDefaultGatheredMembers(): AstTypeReferenceTypeGatheredResult {
        return {};
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
            let astSymbol: AstSymbol | undefined = this.options.itemsRegistry.getAstSymbol(resolvedSymbol);

            if (astSymbol == null) {
                astSymbol = new AstSymbol(this.options, resolvedSymbol);
                options.addAstSymbolToRegistry(astSymbol);
            }

            result.reference = { item: astSymbol };
        }

        return result;
    }
}
