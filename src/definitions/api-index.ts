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
        const parameters = ApiHelpers.GetItemsFromDeclarationsIds(declaration.parameters, this.Options);
        Object.keys(parameters).forEach(key => {
            const value = parameters[key];

            if (!Array.isArray(value)) {
                this.parameter = value;
            }

            return false;
        });
    }

    private parameter: string;

    private getType(): TypeDto {
        if (this.Declaration.type == null) {
            // This should not happen, because we run Semantic Diagnostics before extraction.
            throw new Error("An index signature must have a type annotation.");
        }
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type);
        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiIndexDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const type: TypeDto = this.getType();

        return {
            ApiKind: ApiItemKinds.Index,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Parameter: this.parameter,
            Type: type
        };
    }
}
