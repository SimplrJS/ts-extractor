import * as ts from "typescript";

import { ItemsRegistry } from "../contracts/items-registry";
import { ApiBaseItemDto } from "../contracts/api-base-item-dto";

export interface ApiItemOptions {
    Program: ts.Program;
    ItemsRegistry: ItemsRegistry<ApiItem, ts.Declaration>;
}

export abstract class ApiItem<TDeclaration = ts.Declaration, TExtract = ApiBaseItemDto> {
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

    public abstract Extract(): TExtract;
}
