import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "./abstractions/api-item";

import { ApiSourceFile } from "./definitions/api-source-file";
import { ApiVariable } from "./definitions/api-variable";
import { ApiNamespace } from "./definitions/api-namespace";
import { ApiFunction } from "./definitions/api-function";

export namespace ApiHelpers {
    // TODO: Add return dictionary of ApiItems.
    export function VisitApiItem(declaration: ts.Declaration, symbol: ts.Symbol, options: ApiItemOptions): ApiItem | undefined {
        if (ts.isSourceFile(declaration)) {
            return new ApiSourceFile(declaration, options);
        } else if (ts.isVariableDeclaration(declaration)) {
            return new ApiVariable(declaration, symbol, options);
        } else if (ts.isModuleDeclaration(declaration)) {
            return new ApiNamespace(declaration, symbol, options);
        } else if (ts.isFunctionDeclaration(declaration)) {
            return new ApiFunction(declaration, symbol, options);
        }
        // // TODO: Change this to the warning.
        // throw `Declaration: ${ts.SyntaxKind[declaration.kind]} is not supported.`;
    }
}
