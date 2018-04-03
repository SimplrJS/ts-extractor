import * as ts from "typescript";
import { AstTypeBase, AstTypeBaseDto } from "../ast-type-base";
import { AstItemKind, AstItemMemberReference } from "../../contracts/ast-item";
import { TsHelpers } from "../../ts-helpers";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";

export interface AstTypeReferenceTypeDto extends AstTypeBaseDto {
    referenceId?: string;
    // TODO: MemberReference...
    typeParameters: string[];
}

export class AstTypeReferenceType extends AstTypeBase<AstTypeReferenceTypeDto, ts.TypeReferenceType> {
    public get itemKind(): string {
        return AstItemKind.TypeReferenceType;
    }

    public get name(): string {
        return ts.InternalSymbolName.Type;
    }

    protected onExtract(): AstTypeReferenceTypeDto {
        return {
            name: this.name,
            text: this.text,
            typeParameters: [],
            referenceId: "___"
        };
    }

    public get symbol(): AstSymbol | undefined {
        if (this.symbolReference == null) {
            return undefined;
        }

        return this.options.itemsRegistry.get(this.symbolReference.id) as AstSymbol;
    }

    protected symbolReference: AstItemMemberReference | undefined;

    protected typeParametersReferences: AstItemMemberReference[] = [];

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        // Resolving symbol
        const parent = this.getParent();
        // Checking if this type is referecing to itself.
        let isSelf: boolean;
        if (parent != null && parent instanceof AstDeclarationBase) {
            const parentSymbol = parent.getParent();
            isSelf = this.item.aliasSymbol === parentSymbol.item;
        } else {
            isSelf = false;
        }
        const resolvedSymbol = isSelf ? this.item.getSymbol : this.item.aliasSymbol || this.item.getSymbol();
        // if (resolvedSymbol != null) {
        //     const astSymbol = new AstSymbol
        // }

        // Resolving type parameters.
        let typeParameters: Array<AstTypeBase<any, any>> = [];
        if (!TsHelpers.IsNodeSynthesized(this.itemNode) && this.itemNode.typeArguments != null) {
            typeParameters = this.itemNode.typeArguments.map(x =>
                options.resolveType({ ...this.options, parentId: this.itemId }, this.typeChecker.getTypeFromTypeNode(x), x)
            ) as Array<AstTypeBase<any, any>>;
        } else if (TsHelpers.IsTypeWithTypeArguments(this.item)) {
            typeParameters = this.item.typeArguments.map(x =>
                options.resolveType({ ...this.options, parentId: this.itemId }, x, this.typeChecker.typeToTypeNode(x))
            ) as Array<AstTypeBase<any, any>>;
        }
        // Adding type parameters to registry.
        for (const typeParameter of typeParameters) {
            options.addItemToRegistry(typeParameter);
            this.typeParametersReferences.push({ alias: typeParameter.name, id: typeParameter.itemId });
        }

        return [];
    }
}
