import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiFunctionExpressionDto } from "../contracts/api-definitions";
import { ApiItemKind } from "../contracts/api-item-kind";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export type FunctionTypes = ts.FunctionExpression | ts.FunctionTypeNode | ts.ArrowFunction;

export class ApiFunctionExpression extends ApiCallableBase<FunctionTypes, ApiFunctionExpressionDto> {
    protected ResolveApiKind(): ApiItemKind.FunctionExpression | ApiItemKind.FunctionType | ApiItemKind.ArrowFunction {
        if (ts.isFunctionTypeNode(this.Declaration)) {
            return ApiItemKind.FunctionType;
        } else if (ts.isFunctionExpression(this.Declaration)) {
            return ApiItemKind.FunctionExpression;
        } else {
            return ApiItemKind.ArrowFunction;
        }
    }

    public OnExtract(): ApiFunctionExpressionDto {
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
            TypeParameters: this.TypeParameters,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            _ts: this.GetTsDebugInfo()
        };
    }
}
