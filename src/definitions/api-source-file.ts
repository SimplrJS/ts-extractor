import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";

import { ApiVariable } from "./api-variable";

export class ApiSourceFile extends ApiItem {
    private members: { [key: string]: ApiItem };

    constructor(sourceFile: ts.SourceFile, options: ApiItemOptions) {
        const symbol = options.typeChecker.getSymbolAtLocation(sourceFile);
        if (symbol == null || symbol.exports == null) {
            throw Error("Should not happen");
        }

        super(symbol, options);
        this.members = {};

        symbol.exports.forEach(item => {
            if (item.declarations == null) {
                return;
            }
            const declaration: ts.Declaration = item.declarations[0];
            if (ts.isVariableDeclaration(declaration)) {
                this.members[declaration.name.getText()] = new ApiVariable(item, declaration, options);
            }
        });

        const theseMembers = this.members;
    }
}
