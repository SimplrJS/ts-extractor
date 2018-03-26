import * as ts from "typescript";
import { AstItemBase } from "./abstractions/ast-item-base";

export interface ReadonlyAstRegistry {
    get(id: string): AstItemBase<any, any> | undefined;
    has(id: string): boolean;
    hasItem(item: ts.Symbol | ts.Declaration): boolean;
}

export type Item = ts.Symbol | ts.Declaration | ts.Type;

export class AstRegistry implements ReadonlyAstRegistry {
    protected registry: Map<string, AstItemBase<any, any>> = new Map();
    protected itemToItemId: Map<Item, string> = new Map();

    public get(id: string): AstItemBase<any, any> | undefined {
        return this.registry.get(id);
    }

    public set(item: AstItemBase<any, any>): void {
        this.registry.set(item.itemId, item);
        this.itemToItemId.set(item.item, item.itemId);
    }

    public has(itemId: string): boolean {
        return this.registry.has(itemId);
    }

    public hasItem(item: Item): boolean {
        return this.itemToItemId.has(item);
    }
}
