import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiParameterDto } from "../contracts/definitions/api-parameter-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiParameter extends ApiItem<ts.ParameterDeclaration, ApiParameterDto> {
    constructor(declaration: ts.ParameterDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        if (declaration.type != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(declaration.type);

            this.type = ApiHelpers.TypeToApiTypeDto(type, options);
        }
    }

    private type: TypeDto;

    public Extract(): ApiParameterDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Parameter,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Type: this.type
        };
    }
}
