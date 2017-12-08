import * as ts from "typescript";

import { TypeKinds } from "./type-kinds";

export interface BaseTypeDto {
    ApiTypeKind: TypeKinds;
    ReferenceId: string | undefined;
    Text: string;
    Name?: string;
}

export interface TypeScriptSpecificPropertiesDto {
    Flags: ts.TypeFlags;
    FlagsString: string;
}

export type TypeDto = TypeBasicDto | TypeUnionOrIntersectionDto;

export interface TypeBasicDto extends BaseTypeDto, TypeScriptSpecificPropertiesDto {
    ApiTypeKind: TypeKinds.Basic;
    Generics?: TypeDto[];
}

export interface TypeUnionOrIntersectionDto extends BaseTypeDto, TypeScriptSpecificPropertiesDto {
    ApiTypeKind: TypeKinds.Union | TypeKinds.Intersection;
    Types: TypeDto[];
}
