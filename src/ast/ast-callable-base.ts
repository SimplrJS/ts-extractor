import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstDeclarationBase } from "./ast-declaration-base";
import { GatheredMembersResult, AstItemGatherMembersOptions, GatheredMemberMetadata } from "../contracts/ast-item";
import { AstSymbol } from "./ast-symbol";
import { AstType } from "./ast-type-base";

export interface AstCallableGatheredResult extends GatheredMembersResult {
    parameters: Array<GatheredMemberMetadata<AstSymbol>>;
    typeParameters: Array<GatheredMemberMetadata<AstSymbol>>;
    returnType?: GatheredMemberMetadata<AstType>;
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
        return this.gatheredMembers.typeParameters.map(x => x.item);
    }

    public get parameters(): AstSymbol[] {
        return this.gatheredMembers.parameters.map(x => x.item);
    }

    public get returnType(): AstType | undefined {
        if (this.gatheredMembers.returnType == null) {
            return undefined;
        }

        return this.gatheredMembers.returnType.item;
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
            if (!this.options.itemsRegistry.hasItemById(returnAstType.id)) {
                options.addAstItemToRegistry(returnAstType);
            }

            result.returnType = {
                item: returnAstType
            };
        }

        return result as TGatherResult;
    }
}
