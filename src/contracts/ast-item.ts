export enum AstItemKind {
    SourceFile = "source-file",
    Symbol = "symbol"
}

export interface AstItemBaseDto {
    name: string;
}

export interface AstItemMemberReference {
    alias: string;
    id: string;
}
