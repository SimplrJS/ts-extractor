import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstItemBase } from "../abstractions/ast-item-base";
import { AstSymbol } from "./ast-symbol";
import { AstDeclarationIdentifiers } from "../contracts/ast-declaration";
import { GatheredMembersResult, AstItemOptions, AstItemGatherMembersOptions, GatheredMemberMetadata } from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";

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
        const astSymbol = this.options.itemsRegistry.getAstSymbol(this.symbol);
        if (astSymbol != null) {
            return astSymbol;
        }

        return new AstSymbol(this.options, this.symbol);
    }

    @LazyGetter()
    public get id(): string {
        const parentId: string = this.identifiers.parentId != null ? this.identifiers.parentId : this.parent.id;
        const counter: string = this.identifiers.itemCounter != null ? `#${this.identifiers.itemCounter}` : "";

        return `${parentId}#${this.itemKind}${counter}`;
    }

    protected getMembersFromDeclarationList(
        options: AstItemGatherMembersOptions,
        declarations: ts.NodeArray<ts.Declaration> | ts.Declaration[] | undefined
    ): Array<GatheredMemberMetadata<AstSymbol>> {
        const result: Array<GatheredMemberMetadata<AstSymbol>> = [];

        if (declarations == null) {
            return result;
        }

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

    protected getMembersFromSymbolList(
        options: AstItemGatherMembersOptions,
        symbols: ts.UnderscoreEscapedMap<ts.Symbol> | undefined
    ): Array<GatheredMemberMetadata<AstSymbol>> {
        const result: Array<GatheredMemberMetadata<AstSymbol>> = [];
        if (symbols == null) {
            return result;
        }

        symbols.forEach(symbol => {
            let astSymbol: AstSymbol | undefined = this.options.itemsRegistry.getAstSymbol(symbol);
            if (astSymbol == null) {
                astSymbol = new AstSymbol(this.options, symbol, { parentId: this.id });
                options.addAstSymbolToRegistry(astSymbol);
            }

            result.push({
                item: astSymbol
            });
        });

        return result;
    }
}
