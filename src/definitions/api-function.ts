import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiParameter } from "./api-parameter";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiFunctionDto } from "../contracts/definitions/api-function-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableBase } from "../abstractions/api-callable-base";

export class ApiFunction extends ApiCallableBase<ts.FunctionDeclaration, ApiFunctionDto> {
    public Extract(): ApiFunctionDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Function,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            TypeParameters: this.typeParameters,
            Parameters: this.parameters,
            ReturnType: this.returnType
        };
    }
}
