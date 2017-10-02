import * as ts from "typescript";

export interface ApiItemOptions {
    typeChecker: ts.TypeChecker;
    program: ts.Program;
}

// TODO: Accept generic to have specific Declaration.
export abstract class ApiItem<TDeclaration = ts.Declaration> {
    protected TypeChecker: ts.TypeChecker;
    protected Program: ts.Program;

    constructor(protected Declaration: TDeclaration, protected Symbol: ts.Symbol, options: ApiItemOptions) {
        this.TypeChecker = options.typeChecker;
        this.Program = options.program;
    }

    /**
     * Temp method for items debugging.
     */
    public abstract ToJson(): { [key: string]: any };
}
