import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiFunctionTypeDto } from "../contracts/definitions/api-function-type-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiFunctionType extends ApiCallableBase<ts.FunctionTypeNode | ts.ArrowFunction, ApiFunctionTypeDto> {
    protected ResolveApiKind(): ApiItemKinds.FunctionType | ApiItemKinds.ArrowFunction {
        if (ts.isFunctionTypeNode(this.Declaration)) {
            return ApiItemKinds.FunctionType;
        } else {
            return ApiItemKinds.ArrowFunction;
        }
    }

    public OnExtract(): ApiFunctionTypeDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);
        const apiKind = this.ResolveApiKind();

        return {
            ApiKind: apiKind,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: location,
            IsOverloadBase: this.IsOverloadBase,
            TypeParameters: this.TypeParameters,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            _ts: this.GetTsDebugInfo()
        };
    }
}
