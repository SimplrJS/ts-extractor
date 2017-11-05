import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeDto } from "../contracts/definitions/api-type-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";

export class ApiType extends ApiItem<ts.TypeAliasDeclaration, ApiTypeDto> {
    constructor(declaration: ts.TypeAliasDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }
    }

    private typeParameters: ApiItemReferenceDictionary = {};

    public GetType(): TypeDto {
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);

        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiTypeDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const type: TypeDto = this.GetType();

        return {
            ApiKind: ApiItemKinds.Type,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Type: type,
            TypeParameters: this.typeParameters
        };
    }
}
