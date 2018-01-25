import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";

import { ApiTypeParameterDto } from "../contracts/definitions/api-type-parameter-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiType } from "../contracts/api-type";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiTypeParameter extends ApiItem<ts.TypeParameterDeclaration, ApiTypeParameterDto> {
    private location: ApiItemLocationDto;
    private constraintType: ApiType | undefined;
    private defaultType: ApiType | undefined;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Constraint type
        if (this.Declaration.constraint != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.constraint);
            this.constraintType = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.constraint);
        }

        // Default type
        if (this.Declaration.default != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.default);
            this.defaultType = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.default);
        }
    }

    public OnExtract(): ApiTypeParameterDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.TypeParameter,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            ConstraintType: this.constraintType,
            DefaultType: this.defaultType,
            _ts: this.GetTsDebugInfo()
        };
    }
}
