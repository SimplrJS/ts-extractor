import * as ts from "typescript";
import { TsHelpers } from "./ts-helpers";
import { AstDeclarations } from "./ast/ast-declarations";

export namespace ExtractorHelpers {
    /**
     * @throws Not supported syntax kind.
     */
    export function resolveNodeParentId(item: ts.Node): string {
        const path: string[] = [];

        for (let i: ts.Node | undefined = item; i != null; i = i.parent) {
            const $constructor = AstDeclarations.get(i.kind);
            if ($constructor == null) {
                throw new Error(`Not supported declaration syntax kind "${ts.SyntaxKind[i.kind]}".`);
            }
        }

        return "";
    }
}
