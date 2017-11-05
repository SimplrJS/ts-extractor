import * as ts from "typescript";

import { ApiItemKinds } from "./api-item-kinds";
import { TypeKinds } from "./type-kinds";

export interface BaseTypeDto {
    ApiTypeKind: TypeKinds;
    Text: string;
    Name?: string;
}

export interface TypeScriptSpecificPropertiesDto {
    Flags: ts.TypeFlags;
    FlagsString: string;
}

export type TypeDto = TypeBasicDto | TypeUnionOrIntersectionDto | TypeReferenceDto;

export interface TypeBasicDto extends BaseTypeDto, TypeScriptSpecificPropertiesDto {
    ApiTypeKind: TypeKinds.Basic;
    Generics?: TypeDto[];
}

export interface TypeUnionOrIntersectionDto extends BaseTypeDto, TypeScriptSpecificPropertiesDto {
    ApiTypeKind: TypeKinds.Union | TypeKinds.Intersection;
    Types: TypeDto[];
}

export interface TypeReferenceDto extends BaseTypeDto {
    ApiTypeKind: TypeKinds.Reference;
    ReferenceId: string;
    Generics?: TypeDto[];
}
