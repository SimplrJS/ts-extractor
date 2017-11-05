import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiConstructDto } from "../contracts/definitions/api-construct-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { AccessModifier } from "../contracts/access-modifier";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiConstruct extends ApiItem<ts.ConstructSignatureDeclaration, ApiConstructDto> {
    constructor(declaration: ts.ConstructSignatureDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

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

    public Extract(): ApiConstructDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Construct,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Parameters: this.parameters
        };
    }
}
