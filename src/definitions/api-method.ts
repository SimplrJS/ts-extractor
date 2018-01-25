import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiMethodDto } from "../contracts/definitions/api-method-dto";
import { ApiItemKind } from "../contracts/api-item-kind";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export class ApiMethod extends ApiCallableBase<ts.MethodSignature, ApiMethodDto> {
    private isOptional: boolean;

    public OnGatherData(): void {
        super.OnGatherData();

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);
    }

    public OnExtract(): ApiMethodDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKind.Method,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.Location,
            IsOverloadBase: this.IsOverloadBase,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            IsOptional: this.isOptional,
            TypeParameters: this.TypeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
