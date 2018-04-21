import * as ts from "typescript";

import { AstItemOptions, AstItemBase } from "../abstractions/ast-item-base";
import { AstTypeIdentifiers } from "../contracts/ast-type";

// Types
import { AstTypeReferenceType } from "./types/ast-type-reference-type";

export interface AstTypeConstructor<TTypeNode extends ts.TypeNode> {
    new (options: AstItemOptions, item: ts.Type, typeNode: TTypeNode, identifiers: AstTypeIdentifiers): AstItemBase<ts.Type, any, any>;
}

export const AstTypes: Map<ts.SyntaxKind, AstTypeConstructor<any>> = new Map([
    [ts.SyntaxKind.TypeReference, AstTypeReferenceType]
]);
