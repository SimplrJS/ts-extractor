import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiVariable } from "./api-variable";

export class ApiSourceFile extends ApiItem<ts.SourceFile> {
    constructor(sourceFile: ts.SourceFile, options: ApiItemOptions) {
        const symbol = TSHelpers.GetSymbolFromDeclaration(sourceFile, options.Program.getTypeChecker());
        if (symbol == null || symbol.exports == null) {
            throw Error("Should not happen");
        }

        super(sourceFile, symbol, options);
        this.members = {};

        symbol.exports.forEach(item => {
            if (item.declarations == null) {
                return;
            }

            const declaration: ts.Declaration = item.declarations[0];
            const visitedItem = ApiHelpers.VisitApiItem(declaration, item, {
                Program: this.Program,
                ItemsRegistry: this.ItemsRegistry
            });

            if (visitedItem == null) {
                return;
            }

            this.members[item.getName()] = visitedItem;
        });

        const theseMembers = this.members;
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
            Kind: "source-file",
            FileName: this.Declaration.getSourceFile().fileName,
            Members: membersJson
        };
    }
}
