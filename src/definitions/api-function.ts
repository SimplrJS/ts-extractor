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
import { ApiFunctionBase } from "../abstractions/api-function-base";

export class ApiFunction extends ApiFunctionBase<ts.FunctionDeclaration, ApiFunctionDto> {
    public Extract(): ApiFunctionDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const returnType: TypeDto | undefined = this.GetReturnType();

        return {
            ApiKind: ApiItemKinds.Function,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            TypeParameters: this.typeParameters,
            Parameters: this.parameters,
            ReturnType: returnType
        };
    }
 }
