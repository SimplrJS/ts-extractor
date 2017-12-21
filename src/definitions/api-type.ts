import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";

import { ApiTypeDto } from "../contracts/definitions/api-type-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiType extends ApiItem<ts.TypeAliasDeclaration, ApiTypeDto> {
    private typeParameters: ApiItemReference[] = [];
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
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Type,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Type: this.type,
            TypeParameters: this.typeParameters
        };
    }
}
