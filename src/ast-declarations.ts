import * as ts from "typescript";

// Declarations
import { AstSourceFile } from "./ast/ast-source-file";
import { AstVariable } from "./ast/ast-variable";
import { AstItemBase, AstItemOptions } from "./abstractions/api-item-base";

export interface AstDeclarationConstructor<TItem> {
    new (options: AstItemOptions, item: TItem): AstItemBase<any, TItem>;
}

/**
 * @internal
 */
const declarationsArray: ReadonlyArray<[ts.SyntaxKind, AstDeclarationConstructor<any>]> = [
    [ts.SyntaxKind.SourceFile, AstSourceFile],
    [ts.SyntaxKind.VariableDeclaration, AstVariable]
];

export const AstDeclarations: Map<ts.SyntaxKind, AstDeclarationConstructor<any>> = new Map(declarationsArray);
