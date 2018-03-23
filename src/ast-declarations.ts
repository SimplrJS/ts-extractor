import * as ts from "typescript";

import { AstDeclarationBase } from "./ast/ast-declaration-base";
import { AstItemOptions } from "./abstractions/ast-item-base";

// Declarations
import { AstSourceFile } from "./ast/ast-source-file";
import { AstVariable } from "./ast/ast-variable";
import { AstFunction } from "./ast/ast-function";
import { AstParameter } from "./ast/ast-parameter";

export interface AstDeclarationConstructor<TItem extends ts.Declaration> {
    new (options: AstItemOptions, item: TItem): AstDeclarationBase<any, TItem>;
}

/**
 * @internal
 */
const declarationsArray: ReadonlyArray<[ts.SyntaxKind, AstDeclarationConstructor<any>]> = [
    [ts.SyntaxKind.SourceFile, AstSourceFile],
    [ts.SyntaxKind.VariableDeclaration, AstVariable],
    [ts.SyntaxKind.FunctionDeclaration, AstFunction],
    [ts.SyntaxKind.Parameter, AstParameter]
];

export const AstDeclarations: Map<ts.SyntaxKind, AstDeclarationConstructor<any>> = new Map(declarationsArray);
