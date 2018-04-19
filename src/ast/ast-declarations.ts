import * as ts from "typescript";

import { AstItemOptions, AstItemBase } from "../abstractions/ast-item-base";

// Declarations
import { AstSourceFile } from "./declarations/ast-source-file";

export interface AstDeclarationConstructor<TItem extends ts.Declaration = ts.Declaration> {
    new (options: AstItemOptions, item: TItem): AstItemBase<TItem, any>;
}

export const AstDeclarations: Map<ts.SyntaxKind, AstDeclarationConstructor<any>> = new Map([
    [ts.SyntaxKind.SourceFile, AstSourceFile]
]);
