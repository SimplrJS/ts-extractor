import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiIndexDto } from "../contracts/definitions/api-index-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiIndex extends ApiItem<ts.IndexSignatureDeclaration, ApiIndexDto> {
    constructor(declaration: ts.IndexSignatureDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Parameter
        const parameters = ApiHelpers.GetItemsIdsFromDeclarations(declaration.parameters, this.Options);
        Object.keys(parameters).forEach(key => {
            const value = parameters[key];

            if (!Array.isArray(value)) {
                this.parameter = value;
            }

            return false;
        });

        // Type
        if (this.Declaration.type == null) {
            // This should not happen, because we run Semantic Diagnostics before extraction.
            throw new Error("An index signature must have a type annotation.");
        }
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    private parameter: string;
    private type: TypeDto;

    public Extract(): ApiIndexDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Index,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Parameter: this.parameter,
            Type: this.type
        };
    }
}
