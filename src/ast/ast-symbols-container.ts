import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";
import { LoggerBuilder } from "simplr-logger";

import { AstSymbol } from "./ast-symbol";
import { AstItem, AstItemKind } from "../contracts/ast-item";

export interface AstSymbolsContainerOptions {
    logger: LoggerBuilder;
}

export class AstSymbolsContainer implements AstItem<AstSymbol[], {}> {
    constructor(options: AstSymbolsContainerOptions, items: AstSymbol[] = []) {
        this.logger = options.logger;
        this.items = items;
    }

    protected readonly logger: LoggerBuilder;
    public readonly itemKind: AstItemKind = AstItemKind.SymbolsContainer;

    @LazyGetter()
    public get id(): string {
        for (const item of this.item) {
            return item.id;
        }

        this.logger.Error("Failed to resolve AstSymbolsContainer's id.");
        return "__UNRESOLVED-ID";
    }

    private items: AstSymbol[];

    public get item(): AstSymbol[] {
        return this.items;
    }

    /**
     * Used by AstRegistry.
     * @internal
     */
    public addAstSymbol(astSymbol: AstSymbol): void {
        if (this.item.findIndex(x => x.item === astSymbol.item) === -1) {
            this.item.push(astSymbol);
        }
    }

    public getAstSymbol(symbol: ts.Symbol): AstSymbol | undefined {
        return this.items.find(x => x.item === symbol);
    }

    public extract(): {} {
        throw new Error("Method not implemented.");
    }
}
