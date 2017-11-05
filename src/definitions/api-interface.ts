import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiInterfaceDto } from "../contracts/definitions/api-interface-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiInterface extends ApiItem<ts.InterfaceDeclaration, ApiInterfaceDto> {
    constructor(declaration: ts.InterfaceDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Members
        this.members = ApiHelpers.GetItemsIdsFromDeclarations(declaration.members, this.Options);

        // Extends
        if (declaration.heritageClauses != null) {
            this.extends = ApiHelpers.GetHeritageList(declaration.heritageClauses, ts.SyntaxKind.ExtendsKeyword, this.Options);
        }

        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }
    }

    /**
     * Interfaces can extend multiple interfaces.
     */
    private extends: TypeDto[] = [];
    private typeParameters: ApiItemReferenceDictionary = {};
    private members: ApiItemReferenceDictionary = {};

    public Extract(): ApiInterfaceDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Interface,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Members: this.members,
            Extends: this.extends,
            TypeParameters: this.typeParameters
        };
    }
}
