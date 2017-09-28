import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiNamespace extends ApiItem {
    constructor(declaration: ts.ModuleDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        this.members = {};
        if (symbol.exports == null) {
            return;
        }
        symbol.exports.forEach(item => {
            if (item.declarations == null) {
                return;
            }

            const itemDeclaration: ts.Declaration = item.declarations[0];
            const visitedItem = ApiHelpers.VisitApiItem(itemDeclaration, item, {
                program: this.Program,
                typeChecker: this.TypeChecker
            });

            if (visitedItem == null) {
                return;
            }

            this.members[item.getName()] = visitedItem;
        });
    }

    private members: { [key: string]: ApiItem };

    public ToJson(): { [key: string]: any; } {
        const membersJson: { [key: string]: any } = {};

        for (const memberKey in this.members) {
            if (this.members.hasOwnProperty(memberKey)) {
                membersJson[memberKey] = this.members[memberKey].ToJson();
            }
        }

        return {
            Kind: "namespace",
            Members: membersJson
        };
    }

}
