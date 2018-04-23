import * as ts from "typescript";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";
import { AstItemGatherMembersOptions, GatheredMembersResult } from "../../abstractions/ast-item-base";
import { AstTypeBase } from "../ast-type-base";

export interface AstFunctionGatheredResult extends GatheredMembersResult {
    parameters: AstItemMemberReference[];
    returnType?: AstItemMemberReference;
}

export class AstFunction extends AstDeclarationBase<ts.FunctionDeclaration, AstFunctionGatheredResult, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.Function;

    public get name(): string {
        if (this.item.name == null) {
            // Fallback to a Symbol name.
            return this.parent.name;
        }

        return this.item.name.getText();
    }

    protected onExtract(): {} {
        return {};
    }

    public get parameters(): AstSymbol[] {
        return this.gatheredMembers.parameters.map(x => this.options.itemsRegistry.get(x.id)) as AstSymbol[];
    }

    public get returnType(): AstTypeBase | undefined {
        if (this.gatheredMembers.returnType == null) {
            return undefined;
        }

        return this.options.itemsRegistry.get(this.gatheredMembers.returnType.id) as AstTypeBase;
    }

    protected getDefaultGatheredMembers(): AstFunctionGatheredResult {
        return {
            parameters: []
        };
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstFunctionGatheredResult {
        const result: AstFunctionGatheredResult = {
            parameters: this.getMemberReferencesFromDeclarationList(options, this.item.parameters)
        };

        // Resolved return Type.
        const signature = this.typeChecker.getSignatureFromDeclaration(this.item);
        if (signature != null) {
            const type = this.typeChecker.getReturnTypeOfSignature(signature);

            const returnAstType = this.options.resolveAstType(type, undefined, { parentId: this.id });
            if (!this.options.itemsRegistry.has(returnAstType.id)) {
                options.addAstItemToRegistry(returnAstType);
            }

            result.returnType = {
                id: returnAstType.id
            };
        }

        return result;
    }
}
