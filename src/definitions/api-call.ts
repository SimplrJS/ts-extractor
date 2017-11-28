import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiCallDto } from "../contracts/definitions/api-call-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiCall extends ApiCallableBase<ts.CallSignatureDeclaration, ApiCallDto> {
    public OnExtract(): ApiCallDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Call,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            TypeParameters: this.TypeParameters
        };
    }
}
