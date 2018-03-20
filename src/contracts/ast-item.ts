export enum AstItemKind {
    SourceFile = "source-file",
    Symbol = "symbol",
    Variable = "variable"
}

export interface AstItemBaseDto {
    name: string;
}

export interface AstItemMemberReference {
    alias: string;
    id: string;
}
