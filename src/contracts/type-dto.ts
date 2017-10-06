import * as ts from "typescript";

import { ApiItemKinds } from "./api-item-kinds";
import { TypeKinds } from "./type-kinds";

export interface ApiBaseTypeDto {
    ApiTypeKind: TypeKinds;
    Text: string;
    Name?: string;
}

export type ApiTypeDto = ApiTypeDefaultDto | ApiTypeUnionDto | ApiTypeIntersectionDto | ApiTypeReferenceDto;

export interface ApiTypeDefaultDto extends ApiBaseTypeDto {
    ApiTypeKind: TypeKinds.Default;
    Generics?: ApiTypeDto[];
}

export interface ApiTypeUnionDto extends ApiBaseTypeDto {
    ApiTypeKind: TypeKinds.Union;
    Flags: ts.TypeFlags;
    FlagsString: string;
    Types: ApiTypeDto[];
}

export interface ApiTypeIntersectionDto extends ApiBaseTypeDto {
    ApiTypeKind: TypeKinds.Intersection;
    Flags: ts.TypeFlags;
    FlagsString: string;
    Types: ApiTypeDto[];
}

export interface ApiTypeReferenceDto extends ApiBaseTypeDto {
    ApiTypeKind: TypeKinds.Reference;
    Generics?: ApiTypeDto[];
    ReferenceId: string;
}
