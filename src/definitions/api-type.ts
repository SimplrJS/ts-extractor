import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeDto } from "../contracts/definitions/api-type-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";

export class ApiType extends ApiItem<ts.TypeAliasDeclaration, ApiTypeDto> {
    private typeParameters: ApiItemReferenceDictionary = {};
    private type: TypeDto;

    protected OnGatherData(): void {
        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }

        // Type
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public OnExtract(): ApiTypeDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Type,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Type: this.type,
            TypeParameters: this.typeParameters
        };
    }
}
