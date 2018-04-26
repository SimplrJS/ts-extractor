import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstItemBase } from "../abstractions/ast-item-base";
import { AstSymbol } from "./ast-symbol";
import { AstDeclarationIdentifiers } from "../contracts/ast-declaration";
import { GatheredMembersResult, AstItemOptions, AstItemGatherMembersOptions, GatheredMemberMetadata } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";
import { AstSymbolsContainer } from "./ast-symbols-container";

export type AstDeclaration = AstDeclarationBase<ts.Declaration, {}, {}>;

export abstract class AstDeclarationBase<
    TDeclaration extends ts.Declaration,
    TGatherResult extends GatheredMembersResult,
    TExtractedData
> extends AstItemBase<TDeclaration, TGatherResult, TExtractedData> {
    constructor(
        options: AstItemOptions,
        declaration: TDeclaration,
        protected readonly symbol: ts.Symbol,
        protected readonly identifiers: AstDeclarationIdentifiers = {}
    ) {
        super(options, declaration);
    }

    public abstract readonly name: string;

    @LazyGetter()
    public get parent(): AstSymbol {
        const parentSymbolId = this.options.itemsRegistry.getIdByItem(this.symbol);
        if (parentSymbolId != null) {
            const astSymbolsContainer = this.options.itemsRegistry.getAstItemById(parentSymbolId) as AstSymbolsContainer;
            const astSymbol = astSymbolsContainer.getAstSymbol(this.symbol);

            if (astSymbol != null) {
                return astSymbol;
            }
        }

        return new AstSymbol(this.options, this.symbol);
    }

    @LazyGetter()
    public get id(): string {
        const parentId: string = this.identifiers.parentId != null ? this.identifiers.parentId : this.parent.id;
        const counter: string = this.identifiers.itemCounter != null ? `#${this.identifiers.itemCounter}` : "";

        return `${parentId}#${this.itemKind}${counter}`;
    }

    protected getMemberReferencesFromDeclarationList(
        options: AstItemGatherMembersOptions,
        declarations: ts.NodeArray<ts.Declaration> | ts.Declaration[]
    ): Array<GatheredMemberMetadata<AstSymbol>> {
        const result: Array<GatheredMemberMetadata<AstSymbol>> = [];

        for (const declaration of declarations) {
            const symbol = TsHelpers.getSymbolFromDeclaration(declaration, this.typeChecker);

            if (symbol != null) {
                let astSymbol: AstSymbol | undefined;
                if (!this.options.itemsRegistry.hasItem(symbol)) {
                    astSymbol = this.options.itemsRegistry.getAstSymbol(symbol);
                }

                if (astSymbol == null) {
                    astSymbol = new AstSymbol(this.options, symbol, { parentId: this.id });
                    options.addAstSymbolToRegistry(astSymbol);
                }

                result.push({ alias: astSymbol.name, item: astSymbol });
            }
        }

        return result;
    }
}
