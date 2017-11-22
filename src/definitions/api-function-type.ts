import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiParameter } from "./api-parameter";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiFunctionTypeDto } from "../contracts/definitions/api-function-type-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiFunctionType extends ApiCallableBase<ts.FunctionTypeNode, ApiFunctionTypeDto> {
    public OnExtract(): ApiFunctionTypeDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = this.GetDeclarationLocation();

        return {
            ApiKind: ApiItemKinds.Function,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            TypeParameters: this.TypeParameters,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType
        };
    }
}
