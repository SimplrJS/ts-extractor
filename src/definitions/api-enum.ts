import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiEnumMember } from "./api-enum-member";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiEnum extends ApiItem<ts.EnumDeclaration> {
    constructor(declaration: ts.EnumDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Members
        declaration.members.forEach(enumMemberDeclaration => {
            const enumMemberSymbol = TSHelpers.GetSymbolFromDeclaration(enumMemberDeclaration, this.TypeChecker);
            if (enumMemberSymbol == null) {
                return;
            }

            this.members[enumMemberSymbol.name] = new ApiEnumMember(enumMemberDeclaration, enumMemberSymbol, options);
        });
    }

    private members: { [key: string]: ApiEnumMember } = {};

    public Extract(): { [key: string]: any; } {
        const membersJson: { [key: string]: any } = {};

        for (const memberKey in this.members) {
            if (this.members.hasOwnProperty(memberKey)) {
                membersJson[memberKey] = this.members[memberKey].Extract();
            }
        }

        return {
            Kind: "enum",
            Name: this.Symbol.name,
            Members: membersJson
        };
    }
}
