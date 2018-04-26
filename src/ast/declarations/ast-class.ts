import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase, AstDeclarationBaseDto } from "../ast-declaration-base";
import {
    AstItemKind,
    GatheredMember,
    GatheredMembersResult,
    AstItemGatherMembersOptions,
    GatheredMemberReference
} from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";
import { AstType } from "../ast-type-base";

export interface AstClassGatheredResult extends GatheredMembersResult {
    members: Array<GatheredMember<AstSymbol>>;
}

export interface AstClassDto extends AstDeclarationBaseDto {
    kind: AstItemKind.Class;
    members: GatheredMemberReference[];
    typeParameters: GatheredMemberReference[];
    extends?: AstType;
    implements: AstType[];
    isAbstract: boolean;
}

export class AstClass extends AstDeclarationBase<ts.ClassDeclaration, AstClassGatheredResult, AstClassDto> {
    @LazyGetter()
    public get name(): string {
        if (this.item.name != null) {
            return this.item.name.getText();
        }

        // Fallback to a Symbol name.
        return this.parent.name;
    }

    public readonly itemKind: AstItemKind.Class = AstItemKind.Class;

    protected onExtract(): AstClassDto {
        return {
            kind: this.itemKind,
            name: this.name,
            members: this.gatheredMembers.members.map<GatheredMemberReference>(x => ({ id: x.item.id, alias: x.alias })),
            extends: undefined,
            implements: [],
            isAbstract: false,
            typeParameters: []
        };
    }

    protected getDefaultGatheredMembers(): AstClassGatheredResult {
        return {
            members: []
        };
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstClassGatheredResult {
        const results: AstClassGatheredResult = {
            members: this.getMembersFromDeclarationList(options, this.item.members)
        };

        return results;
    }
}
