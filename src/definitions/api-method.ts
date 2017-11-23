import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiMethodDto } from "../contracts/definitions/api-method-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";
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
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Method,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Parameters: this.Parameters,
            ReturnType: this.ReturnType,
            IsOptional: this.isOptional,
            TypeParameters: this.TypeParameters
        };
    }
}
