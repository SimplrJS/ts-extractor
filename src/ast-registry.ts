import * as ts from "typescript";
import { LoggerBuilder } from "simplr-logger";

import { AstDeclaration } from "./ast/ast-declaration-base";
import { AstType } from "./ast/ast-type-base";
import { AstSymbol } from "./ast/ast-symbol";

export interface ReadonlyAstRegistry {
    getAstItem(item: ts.Declaration): AstDeclaration | undefined;
    getAstItem(item: ts.Type): AstType | undefined;
    getAstItem(item: ts.Symbol): AstSymbol | undefined;
    getAstItem(item: TsItem): AstDeclaration | AstType | AstSymbol | undefined;

    getAstItemById(id: string): AstDeclaration | AstType | AstSymbol | undefined;
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
    protected registry: Map<string, AstDeclaration | AstType | AstSymbol> = new Map();
    protected itemToItemId: Map<TsItem, string> = new Map();

    public getAstItem(item: ts.Declaration): AstDeclaration | undefined;
    public getAstItem(item: ts.Type): AstType | undefined;
    public getAstItem(item: ts.Symbol): AstSymbol | undefined;
    public getAstItem(item: TsItem): AstDeclaration | AstType | AstSymbol | undefined {
        const id = this.itemToItemId.get(item);
        if (id == null) {
            return undefined;
        }

        return this.registry.get(id);
    }

    public getAstItemById(id: string): AstDeclaration | AstType | AstSymbol | undefined {
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

    public addItem(item: AstDeclaration | AstType | AstSymbol): void {
        this.registry.set(item.id, item);
        this.itemToItemId.set(item.item, item.id);
    }
}
