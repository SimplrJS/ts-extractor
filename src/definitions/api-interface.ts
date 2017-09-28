import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiPropertySignature } from "./api-property-signature";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiInterface extends ApiItem {
    constructor(declaration: ts.InterfaceDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        declaration.members.forEach(memberDeclaration => {
            const memberSymbol = TSHelpers.GetSymbolFromDeclaration(memberDeclaration, this.TypeChecker);
            if (memberSymbol == null) {
                return;
            }

            this.members[memberSymbol.getName()] = this.visitMember(memberDeclaration, memberSymbol, options);
        });

        console.log("hi");
    }

    private members: { [key: string]: any } = {};

    private visitMember(declaration: ts.Declaration, symbol: ts.Symbol, options: ApiItemOptions): ApiItem | undefined {
        if (ts.isPropertySignature(declaration)) {
            return new ApiPropertySignature(declaration, symbol, options);
        }

        console.log(`Declaration: ${ts.SyntaxKind[declaration.kind]} is not supported.`);
    }

    public ToJson(): { [key: string]: any; } {
        const membersJson: { [key: string]: any } = {};

        for (const memberKey in this.members) {
            if (this.members.hasOwnProperty(memberKey)) {
                membersJson[memberKey] = this.members[memberKey].ToJson();
            }
        }

        return {
            Kind: "interface",
            Name: this.Symbol.name,
            Members: membersJson
        };
    }
}
