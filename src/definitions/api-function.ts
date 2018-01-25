import * as ts from "typescript";

import { ApiHelpers } from "../api-helpers";
import { ApiFunctionDto } from "../contracts/definitions/api-function-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export class ApiFunction extends ApiCallableBase<ts.FunctionDeclaration, ApiFunctionDto> {
    private isAsync: boolean;

    public OnGatherData(): void {
        super.OnGatherData();

        // Modifiers
        this.isAsync = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.AsyncKeyword);
    }

    public OnExtract(): ApiFunctionDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Function,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.Location,
            IsOverloadBase: this.IsOverloadBase,
            TypeParameters: this.TypeParameters,
            Parameters: this.Parameters,
            IsAsync: this.isAsync,
            ReturnType: this.ReturnType,
            _ts: this.GetTsDebugInfo()
        };
    }
}
