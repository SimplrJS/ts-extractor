import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiFunctionDto } from "../contracts/definitions/api-function-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

/**
 * A callable api item base.
 */
export abstract class ApiCallableBase<
    TDeclaration extends ts.SignatureDeclaration,
    TExtractDto extends ApiFunctionDto
    >
    extends ApiItem<TDeclaration, TExtractDto> {
    constructor(declaration: TDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        this.parameters = ApiHelpers.GetItemsIdsFromDeclarations(declaration.parameters, this.Options);

        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }
    }

    protected parameters: ApiItemReferenceDictionary = {};
    protected typeParameters: ApiItemReferenceDictionary = {};

    public GetReturnType(): TypeDto | undefined {
        const signature = this.TypeChecker.getSignatureFromDeclaration(this.Declaration);
        if (signature == null) {
            return;
        }
        const type = this.TypeChecker.getReturnTypeOfSignature(signature);

        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }
}
