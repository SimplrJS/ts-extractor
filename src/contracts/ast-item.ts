export enum AstItemKind {
    SourceFile = "source-file",
    Symbol = "symbol",
    // Declarations
    Variable = "variable",
    Function = "function",
    Parameter = "parameter",
    // Types
    TypeBasic = "type-basic"
}

export interface AstItemBaseDto {
    name: string;
}

export interface AstItemMemberReference {
    alias: string;
    id: string;
}
