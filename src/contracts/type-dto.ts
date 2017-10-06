import * as ts from "typescript";

import { ApiItemKinds } from "./api-item-kinds";
import { TypeKinds } from "./type-kinds";

export interface ApiBaseTypeDto {
    ApiTypeKind: TypeKinds;
    Text: string;
    Name?: string;
}

export interface ApiTypeScriptSpecificPropertiesDto {
    Flags: ts.TypeFlags;
    FlagsString: string;
}

export type ApiTypeDto = ApiTypeDefaultDto | ApiTypeUnionOrIntersectionDto | ApiTypeReferenceDto;

export interface ApiTypeDefaultDto extends ApiBaseTypeDto, ApiTypeScriptSpecificPropertiesDto {
    ApiTypeKind: TypeKinds.Default;
    Generics?: ApiTypeDto[];
}

export interface ApiTypeUnionOrIntersectionDto extends ApiBaseTypeDto, ApiTypeScriptSpecificPropertiesDto {
    ApiTypeKind: TypeKinds.Union | TypeKinds.Intersection;
    Types: ApiTypeDto[];
}

export interface ApiTypeReferenceDto extends ApiBaseTypeDto {
    ApiTypeKind: TypeKinds.Reference;
    ReferenceId: string;
    Generics?: ApiTypeDto[];
}
