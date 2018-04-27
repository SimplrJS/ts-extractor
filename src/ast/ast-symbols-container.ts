import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";
import { LoggerBuilder } from "simplr-logger";

import { AstSymbol, AstSymbolDto } from "./ast-symbol";
import { AstItem, AstItemKind } from "../contracts/ast-item";

export interface AstSymbolsContainerOptions {
    logger: LoggerBuilder;
}

export interface AstSymbolsContainerDto {
    kind: AstItemKind.SymbolsContainer;
    name: string;
    symbols: AstSymbolDto[];
}

export class AstSymbolsContainer implements AstItem<AstSymbol[], AstSymbolsContainerDto> {
    constructor(options: AstSymbolsContainerOptions, items: AstSymbol[] = []) {
        this.logger = options.logger;
        this.items = items;
    }

    protected readonly logger: LoggerBuilder;
    public readonly itemKind: AstItemKind.SymbolsContainer = AstItemKind.SymbolsContainer;

    @LazyGetter()
    public get id(): string {
        for (const item of this.item) {
            return item.id;
        }

        this.logger.Error("Failed to resolve AstSymbolsContainer's id.");
        return "__UNRESOLVED-ID";
    }

    @LazyGetter()
    public get name(): string {
        for (const item of this.item) {
            return item.name;
        }

        this.logger.Error("Failed to resolve AstSymbolsContainer's name.");
        return "__UNRESOLVED-NAME";
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

    public extract(): AstSymbolsContainerDto {
        const symbols = this.items.map<AstSymbolDto>(x => x.extract());

        return {
            kind: this.itemKind,
            name: this.name,
            symbols: symbols
        };
    }
}
