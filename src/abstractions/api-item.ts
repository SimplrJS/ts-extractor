import * as ts from "typescript";

export interface ApiItemOptions {
    typeChecker: ts.TypeChecker;
}

export abstract class ApiItem {
    protected TypeChecker: ts.TypeChecker;

    constructor(protected Symbol: ts.Symbol, options: ApiItemOptions) {
        this.TypeChecker = options.typeChecker;
    }
}
