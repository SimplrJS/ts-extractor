import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";

import { ApiTypeAliasDto } from "../contracts/definitions/api-type-alias-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiType } from "../contracts";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiTypeAlias extends ApiItem<ts.TypeAliasDeclaration, ApiTypeAliasDto> {
    private location: ApiItemLocationDto;
    private typeParameters: ApiItemReference[] = [];
    private type: ApiType;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.typeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }

        // Type
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type);
        const self = type.aliasSymbol === this.Symbol;
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.type, self);
    }

    public OnExtract(): ApiTypeAliasDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.TypeAlias,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            Type: this.type,
            TypeParameters: this.typeParameters,
            _ts: this.GetTsDebugInfo()
        };
    }
}
