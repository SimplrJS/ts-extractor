import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";

import { ApiDefinitionKind, ApiMappedDto } from "../contracts/api-definitions";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiType } from "../contracts/api-types";
import { TsHelpers } from "../ts-helpers";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiMapped extends ApiItem<ts.MappedTypeNode, ApiMappedDto> {
    private location: ApiItemLocationDto;
    private typeParameter: string | undefined;
    private type: ApiType;
    private isReadonly: boolean;
    private isOptional: boolean;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // TypeParameter
        const typeParameterSymbol = TsHelpers.GetSymbolFromDeclaration(this.Declaration.typeParameter, this.TypeChecker);
        if (typeParameterSymbol != null) {
            this.typeParameter = ApiHelpers.GetItemId(this.Declaration.typeParameter, typeParameterSymbol, this.Options);
        }

        /**
         * Type
         * getTypeFromTypeNode method handles undefined and returns `any` type.
         */
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type!);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.type);

        // Readonly
        this.isReadonly = Boolean(this.Declaration.readonlyToken);

        // Optional
        this.isOptional = Boolean(this.Declaration.questionToken);
    }

    public OnExtract(): ApiMappedDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiDefinitionKind.Mapped,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            TypeParameter: this.typeParameter,
            IsOptional: this.isOptional,
            IsReadonly: this.isReadonly,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
