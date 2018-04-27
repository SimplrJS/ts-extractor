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
import { TsHelpers } from "../../ts-helpers";
import { ExtractorHelpers } from "../../extractor-helpers";

export interface AstClassGatheredResult extends GatheredMembersResult {
    members: Array<GatheredMember<AstSymbol>>;
    typeParameters: Array<GatheredMember<AstSymbol>>;
    implements: Array<GatheredMember<AstType>>;
    extends?: GatheredMember<AstType>;
}

export interface AstClassDto extends AstDeclarationBaseDto {
    kind: AstItemKind.Class;
    members: GatheredMemberReference[];
    typeParameters: GatheredMemberReference[];
    extends?: GatheredMemberReference;
    implements: GatheredMemberReference[];
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
        const members = this.gatheredMembers.members.map<GatheredMemberReference>(x => ({ id: x.item.id, alias: x.alias }));
        const typeParameters = this.gatheredMembers.typeParameters.map<GatheredMemberReference>(x => ({ id: x.item.id, alias: x.alias }));
        const isAbstract = TsHelpers.modifierKindExistsInModifiers(this.item.modifiers, ts.SyntaxKind.AbstractKeyword);

        // Extends and implements
        const $implements = this.gatheredMembers.implements.map<GatheredMemberReference>(x => ({ id: x.item.id }));
        let $extends: GatheredMemberReference | undefined;
        if (this.gatheredMembers.extends != null) {
            $extends = { id: this.gatheredMembers.extends.item.id };
        }

        return {
            kind: this.itemKind,
            name: this.name,
            typeParameters: typeParameters,
            members: members,
            extends: $extends,
            implements: $implements,
            isAbstract: isAbstract
        };
    }

    protected getDefaultGatheredMembers(): AstClassGatheredResult {
        return {
            members: [],
            typeParameters: [],
            implements: []
        };
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstClassGatheredResult {
        const results: AstClassGatheredResult = {
            ...this.getDefaultGatheredMembers(),
            members: this.getMembersFromDeclarationList(options, this.item.members),
            typeParameters: this.getMembersFromDeclarationList(options, this.item.typeParameters)
        };

        // extends and implements.
        if (this.item.heritageClauses != null) {
            const $implements = this.item.heritageClauses.find(x => x.token === ts.SyntaxKind.ImplementsKeyword);
            const $extends = this.item.heritageClauses.find(x => x.token === ts.SyntaxKind.ExtendsKeyword);

            if ($implements != null) {
                $implements.types.forEach(expressionType => {
                    const type = this.typeChecker.getTypeFromTypeNode(expressionType);
                    const astType = this.options.resolveAstType(type, expressionType, { parentId: this.id });

                    results.implements.push({ item: astType });
                });
            }

            if ($extends != null) {
                $extends.types.forEach(expressionType => {
                    const type = this.typeChecker.getTypeFromTypeNode(expressionType);
                    const astType = this.options.resolveAstType(type, expressionType, { parentId: this.id });

                    if (results.extends == null) {
                        results.extends = { item: astType };
                    } else {
                        ExtractorHelpers.logWithNodePosition(
                            expressionType,
                            "Class extends has more than one type. Please report this bug.",
                            x => this.logger.Warn(x)
                        );
                    }
                });
            }
        }

        return results;
    }
}
