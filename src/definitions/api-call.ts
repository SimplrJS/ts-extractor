import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiCallDto } from "../contracts/definitions/api-call-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export class ApiCall extends ApiCallableBase<ts.CallSignatureDeclaration, ApiCallDto> {
    public OnExtract(): ApiCallDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Call,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.Location,
            IsOverloadBase: this.IsOverloadBase,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            TypeParameters: this.TypeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
