import * as ts from "typescript";
import { AstItemBase } from "../abstractions/ast-item-base";
import { AstItemBaseDto, AstItemMemberReference } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";
import { AstSymbol } from "./ast-symbol";

export abstract class AstDeclarationBase<TExtractDto extends AstItemBaseDto, TDeclaration extends ts.Declaration> extends AstItemBase<
    TExtractDto,
    TDeclaration
> {
    public get itemId(): string {
        const counter: string = this.options.itemCounter != null ? `&${this.options.itemCounter}` : "";
        return `${this.parentId}#${this.itemKind}${counter}`;
    }

    protected getMemberReferencesFromDeclarationList(declarations: ts.NodeArray<ts.Declaration>): AstItemMemberReference[] {
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
                    this.options.addItemToRegistry(astSymbol);
                }
                result.push({ alias: astSymbol.name, id: astSymbol.itemId });
            }
        }

        return result;
    }
}
