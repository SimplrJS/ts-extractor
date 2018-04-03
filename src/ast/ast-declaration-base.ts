import * as ts from "typescript";
import { AstItemBase, AstItemGatherMembersOptions } from "../abstractions/ast-item-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";
import { AstSymbol } from "./ast-symbol";
import { AstTypeBase } from "./ast-type-base";

export abstract class AstDeclarationBase<TExtractDto extends AstItemBaseDto, TDeclaration extends ts.Declaration> extends AstItemBase<
    TExtractDto,
    TDeclaration
> {
    public get itemId(): string {
        const counter: string = this.options.itemCounter != null ? `&${this.options.itemCounter}` : "";
        return `${this.parentId}#${this.itemKind}${counter}`;
    }

    /**
     * Returns this declaration Symbol.
     */
    public getParent(): AstSymbol {
        const parent = this.options.itemsRegistry.get(this.parentId);
        if (parent == null || parent.itemKind !== AstItemKind.Symbol) {
            throw new Error(`Failed to resolve symbol "${this.itemId}"`);
        }

        return parent as AstSymbol;
    }

    protected getMemberReferencesFromDeclarationList(
        options: AstItemGatherMembersOptions,
        declarations: ts.NodeArray<ts.Declaration>
    ): AstItemMemberReference[] {
        const result: AstItemMemberReference[] = [];

        for (const declaration of declarations) {
            const symbol = TsHelpers.GetSymbolFromDeclaration(declaration, this.typeChecker);

            if (symbol != null) {
                const astSymbol = new AstSymbol(
                    {
                        ...this.options,
                        parentId: this.itemId
                    },
                    symbol
                );

                if (!this.options.itemsRegistry.has(astSymbol.itemId)) {
                    options.addItemToRegistry(astSymbol);
                }
                result.push({ alias: astSymbol.name, id: astSymbol.itemId });
            }
        }

        return result;
    }

    protected getMemberReferenceFromType(
        options: AstItemGatherMembersOptions,
        type: ts.Type,
        typeNode?: ts.TypeNode
    ): AstItemMemberReference {
        const astType = options.resolveType(
            {
                ...this.options,
                parentId: this.itemId
            },
            type,
            typeNode
        ) as AstTypeBase<any, any>;

        if (!this.options.itemsRegistry.has(astType.itemId)) {
            options.addItemToRegistry(astType);
        }

        return { alias: astType.name, id: astType.itemId };
    }
}
