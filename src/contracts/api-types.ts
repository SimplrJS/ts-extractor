import * as ts from "typescript";
import { ApiItemLocationDto } from "./api-item-location-dto";

export type ApiType = ApiBasicTypeDto |
    ApiReferenceTypeDto |
    ApiUnionOrIntersectionTypeDto |
    ArrayTypeDto |
    TupleTypeDto |
    TypeLiteralTypeDto |
    MappedTypeDto |
    FunctionTypeTypeDto |
    ThisTypeDto |
    TypePredicateTypeDto |
    TypeOperatorTypeDto |
    IndexedAccessTypeDto |
    ParenthesizedTypeDto |
    ConstructorTypeDto |
    TypeQueryTypeDto;

export enum ApiTypeKind {
    Basic = "basic",
    Reference = "reference",
    Union = "union",
    Intersection = "intersection",
    Array = "array",
    Tuple = "tuple",
    TypeLiteral = "type-literal",
    Mapped = "mapped",
    FunctionType = "function-type",
    This = "this",
    TypePredicate = "type-predicate",
    TypeOperator = "type-operator",
    IndexedAccess = "indexed-access",
    Parenthesized = "parenthesized",
    Constructor = "constructor",
    TypeQuery = "type-query"
}

export enum TypeKeywords {
    Unknown = "???",
    Keyof = "keyof",
    Typeof = "typeof"
}

export interface TypeScriptTypeNodeDebug {
    Kind: ts.SyntaxKind;
    KindString: string;
}

//#region Types base
export interface ApiBaseType {
    ApiTypeKind: ApiTypeKind;
    Location: ApiItemLocationDto;
    Text: string;
    _ts?: TypeScriptTypeNodeDebug;
}

export interface ApiMembersBaseType extends ApiBaseType {
    Members: ApiType[];
}

export interface ApiReferenceBaseType extends ApiBaseType {
    ReferenceId?: string;
}
//#endregion

//#region Types
export interface ApiBasicTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Basic;
}

export interface ApiReferenceTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Reference;
    TypeParameters: ApiType[] | undefined;
    SymbolName?: string;
}

export interface ApiUnionOrIntersectionTypeDto extends ApiMembersBaseType {
    ApiTypeKind: ApiTypeKind.Intersection | ApiTypeKind.Union;
}

export interface ArrayTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Array;
    Type: ApiType;
}

export interface TupleTypeDto extends ApiMembersBaseType {
    ApiTypeKind: ApiTypeKind.Tuple;
}

export interface TypeLiteralTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypeLiteral;
    ReferenceId?: string;
}

export interface MappedTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Mapped;
}

export interface FunctionTypeTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.FunctionType;
}

export interface ThisTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.This;
}

export interface ConstructorTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Constructor;
}

export interface TypePredicateTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypePredicate;
    ParameterName: string;
    Type: ApiType;
}

export interface TypeOperatorTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypeOperator;
    Keyword: TypeKeywords.Keyof | TypeKeywords.Unknown;
    Type: ApiType;
}

export interface IndexedAccessTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.IndexedAccess;
    ObjectType: ApiType;
    IndexType: ApiType;
}

export interface ParenthesizedTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Parenthesized;
    Type: ApiType;
}

export interface TypeQueryTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.TypeQuery;
    Keyword: TypeKeywords.Typeof;
}
//#endregion
