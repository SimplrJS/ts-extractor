import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiProperty } from "./api-property";
import { ApiMethod } from "./api-method";

export class ApiInterface extends ApiItem {
    constructor(declaration: ts.InterfaceDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Members
        declaration.members.forEach(memberDeclaration => {
            const memberSymbol = TSHelpers.GetSymbolFromDeclaration(memberDeclaration, this.TypeChecker);
            if (memberSymbol == null) {
                return;
            }

            const item = this.visitMember(memberDeclaration, memberSymbol, options);
            if (item != null) {
                this.members[memberSymbol.getName()] = item;
            }
        });

        // Extends
        if (declaration.heritageClauses != null) {
            this.extends = TSHelpers.GetHeritageList(declaration.heritageClauses, ts.SyntaxKind.ExtendsKeyword, this.TypeChecker);
        }
    }

    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: string[] = [];
    private members: { [key: string]: any } = {};

    private visitMember(declaration: ts.Declaration, symbol: ts.Symbol, options: ApiItemOptions): ApiItem | undefined {
        if (ts.isPropertySignature(declaration)) {
            return new ApiProperty(declaration, symbol, options);
        } else if (ts.isMethodSignature(declaration)) {
            return new ApiMethod(declaration, symbol, options);
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
            Members: membersJson,
            Extends: this.extends
        };
    }
}
