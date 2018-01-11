import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";

import { ApiMappedDto } from "../contracts/definitions/api-mapped-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { TSHelpers } from "../ts-helpers";
import { TypeDto } from "../contracts/type-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

// export declare const mapped: { [K in 'a-b-c']: number }
// TODO: Add tests.
export class ApiMapped extends ApiItem<ts.MappedTypeNode, ApiMappedDto> {
    private typeParameter: string | undefined;
    private type: TypeDto;
    private isReadonly: boolean;
    private isOptional: boolean;

    protected OnGatherData(): void {
        // TypeParameter
        const typeParameterSymbol = TSHelpers.GetSymbolFromDeclaration(this.Declaration.typeParameter, this.TypeChecker);
        if (typeParameterSymbol != null) {
            this.typeParameter = ApiHelpers.GetItemId(this.Declaration.typeParameter, typeParameterSymbol, this.Options);
        }

        /**
         * Type
         * getTypeFromTypeNode method handles undefined and returns `any` type.
         */
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type!);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);

        const result = ApiTypeHelpers.TypeNodeToApiType(this.Declaration.type!, this.Options);
        console.log(result);
        debugger;

        // Modifiers
        this.isReadonly = ApiHelpers.ModifierKindExistsInModifiers(this.Declaration.modifiers, ts.SyntaxKind.ReadonlyKeyword);

        // Optional
        this.isOptional = Boolean(this.Declaration.questionToken);
    }

    public OnExtract(): ApiMappedDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Mapped,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            TypeParameter: this.typeParameter,
            IsOptional: this.isOptional,
            IsReadonly: this.isReadonly,
            Type: this.type
        };
    }
}
