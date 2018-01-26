import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiConstructDto } from "../contracts/api-definitions";
import { ApiItemKind } from "../contracts/api-item-kind";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export class ApiConstruct extends ApiCallableBase<ts.ConstructSignatureDeclaration | ts.ConstructorTypeNode, ApiConstructDto> {
    protected ResolveApiKind(): ApiItemKind.Construct | ApiItemKind.ConstructorType {
        if (ts.isConstructSignatureDeclaration(this.Declaration)) {
            return ApiItemKind.Construct;
        } else {
            return ApiItemKind.ConstructorType;
        }
    }

    public OnExtract(): ApiConstructDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const apiKind = this.ResolveApiKind();

        return {
            ApiKind: apiKind,
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
