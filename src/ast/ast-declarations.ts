import * as ts from "typescript";

import { AstDeclarationBase } from "./ast-declaration-base";
import { AstItemOptions } from "../contracts/ast-item";
import { AstDeclarationIdentifiers } from "../contracts/ast-declaration";

// Declarations
import { AstSourceFile } from "./declarations/ast-source-file";
import { AstNamespace } from "./declarations/ast-namespace";
import { AstFunction } from "./declarations/ast-function";
import { AstClass } from "./declarations/ast-class";

export interface AstDeclarationConstructor<TItem extends ts.Declaration = ts.Declaration> {
    new (options: AstItemOptions, declaration: TItem, symbol: ts.Symbol, identifiers?: AstDeclarationIdentifiers): AstDeclarationBase<
        TItem,
        any,
        any
    >;
}

const declarationsArray: ReadonlyArray<[ts.SyntaxKind, AstDeclarationConstructor<any>]> = [
    [ts.SyntaxKind.SourceFile, AstSourceFile],
    [ts.SyntaxKind.ModuleDeclaration, AstNamespace],
    [ts.SyntaxKind.FunctionDeclaration, AstFunction],
    [ts.SyntaxKind.ClassDeclaration, AstClass]
];

export const AstDeclarations: Map<ts.SyntaxKind, AstDeclarationConstructor<ts.Declaration>> = new Map(declarationsArray);
