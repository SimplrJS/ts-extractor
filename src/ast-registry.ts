import * as ts from "typescript";
import { LoggerBuilder } from "simplr-logger";

import { AstDeclaration } from "./ast/ast-declaration-base";
import { AstType } from "./ast/ast-type-base";
import { AstSymbol } from "./ast/ast-symbol";
import { AstSymbolsContainer } from "./ast/ast-symbols-container";

export interface ReadonlyAstRegistry {
    getAstItemById(id: string): AstDeclaration | AstType | AstSymbolsContainer | undefined;
    hasItemById(id: string): boolean;
    hasItem(item: TsItem): boolean;
    getIdByItem(item: TsItem): string | undefined;
    getAstSymbol(symbol: ts.Symbol): AstSymbol | undefined;
}

export type TsItem = ts.Symbol | ts.Declaration | ts.Type;

export interface AstRegistryOptions {
    logger: LoggerBuilder;
}

export class AstRegistry implements ReadonlyAstRegistry {
    constructor(options: AstRegistryOptions) {
        this.logger = options.logger;
    }

    protected readonly logger: LoggerBuilder;
    protected registry: Map<string, AstDeclaration | AstType | AstSymbolsContainer> = new Map();
    protected itemToItemId: Map<TsItem, string> = new Map();

    public getAstItemById(id: string): AstDeclaration | AstType | AstSymbolsContainer | undefined {
        return this.registry.get(id);
    }

    public hasItemById(id: string): boolean {
        return this.registry.has(id);
    }

    public hasItem(item: TsItem): boolean {
        return this.itemToItemId.has(item);
    }

    public getIdByItem(item: TsItem): string | undefined {
        return this.itemToItemId.get(item);
    }

    public addItem(item: AstDeclaration | AstType): void {
        this.registry.set(item.id, item);
        this.itemToItemId.set(item.item, item.id);
    }

    public addSymbol(symbol: AstSymbol): void {
        const itemId = symbol.id;

        let astSymbolsContainer: AstSymbolsContainer;
        if (!this.registry.has(itemId)) {
            astSymbolsContainer = new AstSymbolsContainer({ logger: this.logger }, [symbol]);
            this.registry.set(itemId, astSymbolsContainer);
            return;
        } else {
            astSymbolsContainer = this.registry.get(itemId) as AstSymbolsContainer;
        }

        astSymbolsContainer.addAstSymbol(symbol);
    }

    public getAstSymbol(symbol: ts.Symbol): AstSymbol | undefined {
        const id = this.itemToItemId.get(symbol);
        if (id == null) {
            return undefined;
        }

        const item = this.registry.get(id);
        if (item != null && item instanceof AstSymbolsContainer) {
            return item.getAstSymbol(symbol);
        }

        return undefined;
    }
}
