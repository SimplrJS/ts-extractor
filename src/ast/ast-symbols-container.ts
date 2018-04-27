import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";
import { LoggerBuilder } from "simplr-logger";

import { AstSymbol, AstSymbolDto } from "./ast-symbol";
import { AstItem, AstItemKind } from "../contracts/ast-item";

export interface SymbolsContainer {
    symbols: AstSymbol[];
}

export interface AstSymbolsContainerOptions {
    logger: LoggerBuilder;
}

export interface AstSymbolsContainerDto {
    kind: AstItemKind.SymbolsContainer;
    name: string;
    symbols: AstSymbolDto[];
}

export class AstSymbolsContainer implements AstItem<SymbolsContainer, AstSymbolsContainerDto> {
    constructor(options: AstSymbolsContainerOptions, symbols: AstSymbol[] = []) {
        this.logger = options.logger;
        this.item = {
            symbols: symbols
        };
    }

    protected readonly logger: LoggerBuilder;
    public readonly itemKind: AstItemKind.SymbolsContainer = AstItemKind.SymbolsContainer;
    public readonly item: SymbolsContainer;

    @LazyGetter()
    public get id(): string {
        for (const astSymbol of this.item.symbols) {
            return astSymbol.id;
        }

        this.logger.Error("Failed to resolve AstSymbolsContainer's id.");
        return "__UNRESOLVED-ID";
    }

    @LazyGetter()
    public get name(): string {
        for (const item of this.item.symbols) {
            return item.name;
        }

        this.logger.Error("Failed to resolve AstSymbolsContainer's name.");
        return "__UNRESOLVED-NAME";
    }

    /**
     * Used by AstRegistry.
     * @internal
     */
    public addAstSymbol(astSymbol: AstSymbol): void {
        if (this.item.symbols.findIndex(x => x.item === astSymbol.item) === -1) {
            this.item.symbols.push(astSymbol);
        }
    }

    public getAstSymbol(symbol: ts.Symbol): AstSymbol | undefined {
        return this.item.symbols.find(x => x.item === symbol);
    }

    public extract(): AstSymbolsContainerDto {
        const symbols = this.item.symbols.map<AstSymbolDto>(x => x.extract());

        return {
            kind: this.itemKind,
            name: this.name,
            symbols: symbols
        };
    }
}
