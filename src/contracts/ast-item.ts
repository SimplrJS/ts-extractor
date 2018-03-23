export enum AstItemKind {
    SourceFile = "source-file",
    Symbol = "symbol",
    Variable = "variable",
    Function = "function",
    Parameter = "parameter"
}

export interface AstItemBaseDto {
    name: string;
}

export interface AstItemMemberReference {
    alias: string;
    id: string;
}
