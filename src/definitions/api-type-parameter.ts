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
    private constraintType: ApiType | undefined;
    private defaultType: ApiType | undefined;

    protected OnGatherData(): void {
        // Constraint type
        if (this.Declaration.constraint != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.constraint);
            this.constraintType = ApiTypeHelpers.ResolveApiType(this.Options, type, this.Declaration.constraint);
        }

        // Default type
        if (this.Declaration.default != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.default);
            this.defaultType = ApiTypeHelpers.ResolveApiType(this.Options, type, this.Declaration.default);
        }
    }

    public OnExtract(): ApiTypeParameterDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.TypeParameter,
            Name: this.Symbol.name,
            Metadata: metadata,
            Location: location,
            ConstraintType: this.constraintType,
            DefaultType: this.defaultType,
            _ts: this.GetTsDebugInfo()
        };
    }
}
