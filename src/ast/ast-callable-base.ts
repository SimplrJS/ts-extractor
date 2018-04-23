import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "./ast-declaration-base";
import { GatheredMembersResult, AstItemMemberReference, AstItemGatherMembersOptions } from "../contracts/ast-item";
import { AstSymbol } from "./ast-symbol";
import { AstTypeBase } from "./ast-type-base";

export interface AstCallableGatheredResult extends GatheredMembersResult {
    parameters: AstItemMemberReference[];
    typeParameters: AstItemMemberReference[];
    returnType?: AstItemMemberReference;
}

export abstract class AstCallableBase<
    TDeclaration extends ts.SignatureDeclaration,
    TGatherResult extends AstCallableGatheredResult,
    TExtractedData
> extends AstDeclarationBase<TDeclaration, TGatherResult, TExtractedData> {
    @LazyGetter()
    public get name(): string {
        if (this.item.name != null) {
            return this.item.name.getText();
        }

        // Fallback to a Symbol name.
        return this.parent.name;
    }

    @LazyGetter()
    public get isOverloadBase(): boolean {
        return this.typeChecker.isImplementationOfOverload(this.item as ts.FunctionLike) || false;
    }

    public get typeParameters(): AstSymbol[] {
        return this.gatheredMembers.typeParameters.map(x => this.options.itemsRegistry.get(x.id)) as AstSymbol[];
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

    protected onGatherMembers(options: AstItemGatherMembersOptions): TGatherResult {
        const result: AstCallableGatheredResult = {
            parameters: this.getMemberReferencesFromDeclarationList(options, this.item.parameters),
            typeParameters: this.getMemberReferencesFromDeclarationList(options, this.item.typeParameters || [])
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

        return result as TGatherResult;
    }
}
