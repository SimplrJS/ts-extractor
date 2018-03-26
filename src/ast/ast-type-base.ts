import * as ts from "typescript";
import { AstItemBase, AstItemOptions } from "../abstractions/ast-item-base";
import { AstItemBaseDto, AstItemMemberReference } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";
import { AstSymbol } from "./ast-symbol";

export abstract class AstTypeBase<TExtractDto extends AstItemBaseDto, TTypeNode extends ts.TypeNode> extends AstItemBase<
    TExtractDto,
    ts.Type
> {
    constructor(options: AstItemOptions, item: ts.Type, public readonly itemNode?: TTypeNode) {
        super(options, item);
    }

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
