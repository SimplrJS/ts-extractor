import * as ts from "typescript";
import { LoggerBuilder } from "simplr-logger";

import { ReadonlyAstRegistry } from "../ast-registry";
import { AstDeclarationIdentifiers } from "./ast-declaration";
import { AstDeclarationBase } from "../ast/ast-declaration-base";
import { AstTypeIdentifiers } from "./ast-type";
import { AstTypeBase } from "../ast/ast-type-base";
import { AstItemBase } from "../abstractions/ast-item-base";

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

export enum AstItemStatus {
    Initial = 0,
    GatheredMembers = 1 << 0,
    Extracted = 1 << 1,
    GatheredAndExtracted = GatheredMembers | Extracted
}

export interface GatheredMembersResult {
    [key: string]: AstItemMemberReference | AstItemMemberReference[] | undefined;
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
    addAstItemToRegistry: (item: AstItemBase<any, any, any>) => void;
}
