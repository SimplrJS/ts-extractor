import * as ts from "typescript";
import { LoggerBuilder } from "simplr-logger";

import { AstDeclaration } from "./ast/ast-declaration-base";
import { AstType } from "./ast/ast-type-base";
import { AstSymbol } from "./ast/ast-symbol";
import { AstSymbolsContainer } from "./ast/ast-symbols-container";

export interface ReadonlyAstRegistry {
    getAstItem(item: ts.Declaration): AstDeclaration | undefined;
    getAstItem(item: ts.Type): AstType | undefined;
    getAstSymbol(item: ts.Symbol): AstSymbol | undefined;

    getAstItemById(id: string): AstDeclaration | AstType | AstSymbolsContainer | undefined;
    hasItemById(id: string): boolean;
    hasItem(item: TsItem): boolean;
    getIdByItem(item: TsItem): string | undefined;
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

    public getAstItem(item: ts.Declaration): AstDeclaration | undefined;
    public getAstItem(item: ts.Type): AstType | undefined;
    public getAstItem(item: TsItem): AstDeclaration | AstType | AstSymbolsContainer | undefined {
        const id = this.itemToItemId.get(item);
        if (id == null) {
            return undefined;
        }

        return this.registry.get(id);
    }

    public getAstSymbol(symbol: ts.Symbol): AstSymbol | undefined {
        const id = this.itemToItemId.get(symbol);
        if (id == null) {
            return undefined;
        }
        const astSymbolsContainer = this.registry.get(id) as AstSymbolsContainer | undefined;
        if (astSymbolsContainer == null) {
            return undefined;
        }

        return astSymbolsContainer.getAstSymbol(symbol);
    }

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
        this.itemToItemId.set(symbol.item, itemId);

        let astSymbolsContainer: AstSymbolsContainer;
        if (!this.registry.has(itemId)) {
            this.logger.Debug(`Registry [${itemId}] Symbols container is missing. Creating...`);
            astSymbolsContainer = new AstSymbolsContainer({ logger: this.logger }, [symbol]);
            this.registry.set(itemId, astSymbolsContainer);
        } else {
            astSymbolsContainer = this.registry.get(itemId) as AstSymbolsContainer;
            this.logger.Debug(`Registry [${itemId}] Symbol added to Symbols container.`);
            astSymbolsContainer.addAstSymbol(symbol);
        }
    }
}
