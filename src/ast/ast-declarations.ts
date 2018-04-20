import * as ts from "typescript";

import { AstItemOptions } from "../abstractions/ast-item-base";
import { AstDeclarationBase } from "./ast-declaration-base";

// Declarations
import { AstSourceFile } from "./declarations/ast-source-file";
import { AstNamespace } from "./declarations/ast-namespace";
import { AstFunction } from "./declarations/ast-function";

export interface AstDeclarationConstructor<TItem extends ts.Declaration = ts.Declaration> {
    new (options: AstItemOptions, item: TItem): AstDeclarationBase<TItem, any>;
}

const declarationsArray: ReadonlyArray<[ts.SyntaxKind, AstDeclarationConstructor<any>]> = [
    [ts.SyntaxKind.SourceFile, AstSourceFile],
    [ts.SyntaxKind.ModuleDeclaration, AstNamespace],
    [ts.SyntaxKind.FunctionDeclaration, AstFunction]
];

export const AstDeclarations: Map<ts.SyntaxKind, AstDeclarationConstructor<any>> = new Map(declarationsArray);
