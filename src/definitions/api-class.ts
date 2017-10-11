import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { Logger, LogLevel } from "../utils/logger";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiClassDto } from "../contracts/definitions/api-class-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

export class ApiClass extends ApiItem<ts.ClassDeclaration, ApiClassDto> {
    constructor(declaration: ts.ClassDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Members
        this.members = ApiHelpers.GetItemsFromDeclarationsIds(declaration.members, this.Options);

        // Extends
        if (declaration.heritageClauses != null) {
            const extendingList = ApiHelpers.GetHeritageList(declaration.heritageClauses, ts.SyntaxKind.ExtendsKeyword, this.Options);

            if (extendingList.length > 1) {
                Logger.Log(LogLevel.Warning, "Extending class more than 1 is not supported!");
            }

            if (extendingList.length > 0) {
                this.extends = extendingList[0];
            }
        }

        // Implements
        if (declaration.heritageClauses != null) {
            this.implements = ApiHelpers.GetHeritageList(declaration.heritageClauses, ts.SyntaxKind.ImplementsKeyword, this.Options);
        }

        // IsAbstract
        const modifiers = ApiHelpers.FromModifiersToModifiersDto(declaration.modifiers);
        this.isAbstract = modifiers.IsAbstract;
    }

    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: TypeDto | undefined;
    private implements: TypeDto[] = [];
    private members: ApiItemReferenceDict = {};
    private isAbstract: boolean = false;

    public Extract(): ApiClassDto {
        return {
            ApiKind: ApiItemKinds.Class,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            IsAbstract: this.isAbstract,
            Members: this.members,
            Extends: this.extends,
            Implements: this.implements
        };
    }
}
