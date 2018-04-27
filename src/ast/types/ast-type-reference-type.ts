import * as ts from "typescript";

import { AstTypeBase, AstTypeBaseDto } from "../ast-type-base";
import {
    AstItemKind,
    GatheredMembersResult,
    AstItemGatherMembersOptions,
    GatheredMember,
    GatheredMemberReference
} from "../../contracts/ast-item";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";

export interface AstTypeReferenceTypeGatheredResult extends GatheredMembersResult {
    reference?: GatheredMember<AstSymbol>;
}

export interface AstTypeReferenceTypeDto extends AstTypeBaseDto {
    reference?: GatheredMemberReference;
}

export class AstTypeReferenceType extends AstTypeBase<ts.TypeReferenceType, AstTypeReferenceTypeGatheredResult, AstTypeReferenceTypeDto> {
    public readonly itemKind: AstItemKind = AstItemKind.TypeReferenceType;

    protected onExtract(): AstTypeReferenceTypeDto {
        throw new Error(`[${this.constructor.name}] ${this.onExtract.name} is not implemented.`);
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
