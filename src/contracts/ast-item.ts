export enum AstItemKind {
    SourceFile = "SourceFile",
    Symbol = "Symbol",
    // Declarations
    DeclarationNotSupported = "DeclarationNotSupported",
    Namespace = "Namespace",
    Variable = "Variable",
    Function = "Function",
    Parameter = "Parameter",
    // Types
    TypeBasic = "TypeBasic",
    TypeReferenceType = "TypeReferenceType"
}

export interface AstItemMemberReference {
    id: string;
    alias?: string;
}
