import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiPropertyDto } from "../contracts/definitions/api-property-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiProperty extends ApiItem<ts.PropertySignature, ApiPropertyDto> {
    constructor(declaration: ts.PropertySignature, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, options);
    }

    private type: TypeDto;

    public OnExtract(): ApiPropertyDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Property,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Type: this.type
        };
    }
}
