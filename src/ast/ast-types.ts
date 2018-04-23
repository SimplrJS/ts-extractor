import * as ts from "typescript";

import { AstTypeIdentifiers } from "../contracts/ast-type";

// Types
import { AstTypeReferenceType } from "./types/ast-type-reference-type";
import { AstItemOptions } from "../contracts/ast-item";
import { AstTypeBase } from "./ast-type-base";

export interface AstTypeConstructor<TTypeNode extends ts.TypeNode> {
    new (options: AstItemOptions, item: ts.Type, typeNode: TTypeNode, identifiers: AstTypeIdentifiers): AstTypeBase<TTypeNode>;
}

export const AstTypes: Map<ts.SyntaxKind, AstTypeConstructor<any>> = new Map([[ts.SyntaxKind.TypeReference, AstTypeReferenceType]]);
