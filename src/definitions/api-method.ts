import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiMethodDto } from "../contracts/definitions/api-method-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiMethod extends ApiCallableBase<ts.MethodSignature, ApiMethodDto> {
    private isOptional: boolean;

    public OnGatherData(): void {
        super.OnGatherData();

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);
    }

    public OnExtract(): ApiMethodDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Method,
            Name: this.Symbol.name,
            Metadata: metadata,
            Location: location,
            IsOverloadBase: this.IsOverloadBase,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            IsOptional: this.isOptional,
            TypeParameters: this.TypeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
