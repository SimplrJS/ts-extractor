import * as ts from "typescript";

import { ItemsRegistry } from "../contracts/items-registry";

export interface ApiItemOptions {
    Program: ts.Program;
    ItemsRegistry: ItemsRegistry<ApiItem, ts.Declaration>;
}

// TODO: Accept generic to have specific Declaration.
export abstract class ApiItem<TDeclaration = ts.Declaration> {
    protected TypeChecker: ts.TypeChecker;
    protected Program: ts.Program;
    protected ItemsRegistry: ItemsRegistry<ApiItem, ts.Declaration>;

    constructor(private declaration: TDeclaration, private symbol: ts.Symbol, options: ApiItemOptions) {
        this.Program = options.Program;
        this.TypeChecker = options.Program.getTypeChecker();
        this.ItemsRegistry = options.ItemsRegistry;
    }

    public get Declaration(): TDeclaration {
        return this.declaration;
    }

    public get Symbol(): ts.Symbol {
        return this.symbol;
    }

    /**
     * Temp method for items debugging.
     */
    public abstract ToJson(): { [key: string]: any };
}
