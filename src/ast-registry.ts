import * as ts from "typescript";
import { AstItemBase } from "./abstractions/ast-item-base";

export interface ReadonlyAstRegistry {
    get(id: string): AstItemBase<any, any, any> | undefined;
    has(id: string): boolean;
    hasItem(item: TsItem): boolean;
    getItemId(item: TsItem): string | undefined;
}

export type TsItem = ts.Symbol | ts.Declaration | ts.Type;

export class AstRegistry implements ReadonlyAstRegistry {
    protected registry: Map<string, AstItemBase<any, any, any>> = new Map();
    protected itemToItemId: Map<TsItem, string> = new Map();

    public get(id: string): AstItemBase<any, any, any> | undefined {
        return this.registry.get(id);
    }

    public set(item: AstItemBase<any, any, any>): void {
        this.registry.set(item.id, item);
        this.itemToItemId.set(item.item, item.id);
    }

    public has(itemId: string): boolean {
        return this.registry.has(itemId);
    }

    public hasItem(item: TsItem): boolean {
        return this.itemToItemId.has(item);
    }

    public getItemId(item: TsItem): string | undefined {
        return this.itemToItemId.get(item);
    }
}
