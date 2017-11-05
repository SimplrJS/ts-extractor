import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiParameter } from "./api-parameter";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiCallDto } from "../contracts/definitions/api-call-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiCall extends ApiItem<ts.CallSignatureDeclaration, ApiCallDto> {
    constructor(declaration: ts.CallSignatureDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Parameters
        this.parameters = ApiHelpers.GetItemsFromDeclarationsIds(declaration.parameters, this.Options);
    }

    private parameters: ApiItemReferenceDictionary = {};

    public GetReturnType(): TypeDto | undefined {
        const signature = this.TypeChecker.getSignatureFromDeclaration(this.Declaration);
        if (signature == null) {
            return;
        }
        const type = this.TypeChecker.getReturnTypeOfSignature(signature);

        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiCallDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const returnType: TypeDto | undefined = this.GetReturnType();

        return {
            ApiKind: ApiItemKinds.Call,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Parameters: this.parameters,
            ReturnType: returnType
        };
    }
}
