import * as ts from "typescript";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";
import { AstTypeBase } from "../ast-type-base";
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

    public get returnType(): AstTypeBase | undefined {
        if (this.returnTypeReference == null) {
            return undefined;
        }

        return this.options.itemsRegistry.get(this.returnTypeReference.id) as AstTypeBase;
    }

    private parametersReferences: AstItemMemberReference[] = [];

    private returnTypeReference: AstItemMemberReference | undefined;

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const members: AstItemMemberReference[] = [];

        // Resolved return Type.
        const signature = this.typeChecker.getSignatureFromDeclaration(this.item);
        if (signature != null) {
            const type = this.typeChecker.getReturnTypeOfSignature(signature);

            const returnAstType = this.options.resolveAstType(type, undefined, { parentId: this.getId() });
            if (!this.options.itemsRegistry.hasItem(type)) {
                options.addAstItemToRegistry(returnAstType);
            }
            this.returnTypeReference = { id: returnAstType.getId() };
            members.push(this.returnTypeReference);
        }

        return members;
    }
}
