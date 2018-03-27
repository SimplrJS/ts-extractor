import * as ts from "typescript";

import { AstDeclarationBase } from "./ast-declaration-base";
import { AstItemOptions } from "../abstractions/ast-item-base";

// Declarations
import { AstSourceFile } from "./declarations/ast-source-file";
import { AstVariable } from "./declarations/ast-variable";
import { AstFunction } from "./declarations/ast-function";
import { AstParameter } from "./declarations/ast-parameter";

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
