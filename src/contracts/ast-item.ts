import * as ts from "typescript";
import { LoggerBuilder } from "simplr-logger";

import { ReadonlyAstRegistry } from "../ast-registry";
import { AstDeclarationIdentifiers } from "./ast-declaration";
import { AstDeclarationBase, AstDeclaration } from "../ast/ast-declaration-base";
import { AstTypeIdentifiers } from "./ast-type";
import { AstTypeBase, AstType } from "../ast/ast-type-base";
import { AstSymbol } from "../ast/ast-symbol";

export enum AstItemKind {
    SourceFile = "SourceFile",
    Symbol = "Symbol",
    // Declarations
    DeclarationNotSupported = "DeclarationNotSupported",
    Namespace = "Namespace",
    Variable = "Variable",
    Function = "Function",
    Parameter = "Parameter",
    Class = "Class",
    // Types
    TypeBasic = "TypeBasic",
    TypeReferenceType = "TypeReferenceType"
}

export interface GatheredMemberMetadata<TAstItem extends AstItem<any, any> = any> {
    item: TAstItem;
    alias?: string;
}

export enum AstItemStatus {
    Initial = 0,
    GatheredMembers = 1 << 0,
    Extracted = 1 << 1,
    GatheredAndExtracted = GatheredMembers | Extracted
}

export interface GatheredMembersResult {
    [key: string]: GatheredMemberMetadata | GatheredMemberMetadata[] | undefined;
}

export interface AstItem<TItem, TExtractedData> {
    readonly id: string;
    readonly itemKind: AstItemKind;
    readonly item: TItem;
    extract(): TExtractedData;
}

export interface AstItemOptions {
    program: ts.Program;
    projectDirectory: string;
    itemsRegistry: ReadonlyAstRegistry;
    logger: LoggerBuilder;
    resolveAstDeclaration: (
        declaration: ts.Declaration,
        symbol: ts.Symbol,
        identifiers?: AstDeclarationIdentifiers
    ) => AstDeclarationBase<ts.Declaration, any, any>;
    resolveAstType: (
        type: ts.Type,
        typeNode: ts.TypeNode | undefined,
        identifiers: AstTypeIdentifiers
    ) => AstTypeBase<ts.TypeNode, any, any>;
}

export interface AstItemGatherMembersOptions {
    addAstItemToRegistry: (item: AstDeclaration | AstType | AstSymbol) => void;
}
