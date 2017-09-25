import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";

export class ApiVariable extends ApiItem {
    constructor(symbol: ts.Symbol, private Declaration: ts.VariableDeclaration, options: ApiItemOptions) {
        super(symbol, options);
    }

    public GetType(): string {
        return TSHelpers.TypeToString(this.Declaration, this.Symbol, this.TypeChecker);
    }

    public GetFileLocation(): string {
        return this.Declaration.getSourceFile().fileName;
    }
}
