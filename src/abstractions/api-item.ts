import * as ts from "typescript";

export interface ApiItemOptions {
    typeChecker: ts.TypeChecker;
    program: ts.Program;
}

export abstract class ApiItem {
    protected TypeChecker: ts.TypeChecker;
    protected Program: ts.Program;

    constructor(protected Declaration: ts.Declaration, protected Symbol: ts.Symbol, options: ApiItemOptions) {
        this.TypeChecker = options.typeChecker;
        this.Program = options.program;
    }
}
