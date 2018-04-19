import * as ts from "typescript";

import { AstItemOptions, AstItemBase } from "../abstractions/ast-item-base";

// Types
// import ...

export interface AstTypeConstructor<TTypeNode extends ts.TypeNode> {
    new (options: AstItemOptions, item: ts.Type, typeNode: TTypeNode): AstItemBase<ts.Type, any>;
}

export const AstTypes: Map<ts.SyntaxKind, AstTypeConstructor<any>> = new Map([]);
