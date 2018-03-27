import * as ts from "typescript";

import { AstTypeBase } from "./ast-type-base";
import { AstItemOptions } from "../abstractions/ast-item-base";

// Types

export interface AstTypeConstructor<TTypeNode extends ts.TypeNode> {
    new (options: AstItemOptions, item: ts.Type, typeNode: TTypeNode): AstTypeBase<any, TTypeNode>;
}

/**
 * @internal
 */
const typesArray: ReadonlyArray<[ts.SyntaxKind, AstTypeConstructor<any>]> = [];

export const AstTypes: Map<ts.SyntaxKind, AstTypeConstructor<any>> = new Map(typesArray);
