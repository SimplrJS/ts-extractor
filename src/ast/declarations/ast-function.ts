import * as ts from "typescript";
import { AstItemKind } from "../../contracts/ast-item";
import { AstCallableBase, AstCallableGatheredResult } from "../ast-callable-base";

export class AstFunction extends AstCallableBase<ts.FunctionDeclaration, AstCallableGatheredResult, {}> {
    public readonly itemKind: AstItemKind = AstItemKind.Function;

    protected onExtract(): {} {
        return {};
    }

    protected getDefaultGatheredMembers(): AstCallableGatheredResult {
        return {
            typeParameters: [],
            parameters: []
        };
    }
}
