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

/**
 * @example
 * - `Foo`
 * - `Foo<string>`
 */
export interface ApiReferenceTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Reference;
    TypeParameters: ApiType[] | undefined;
    SymbolName?: string;
}

/**
 * @example
 * - `string | number`
 * - `Foo & Bar`
 */
export interface ApiUnionOrIntersectionTypeDto extends ApiMembersBaseType {
    ApiTypeKind: ApiTypeKind.Intersection | ApiTypeKind.Union;
}

/**
 * @example
 * `string[]`
 */
export interface ArrayTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Array;
    Type: ApiType;
}

/**
 * @example
 * `[string, number]`
 */
export interface TupleTypeDto extends ApiMembersBaseType {
    ApiTypeKind: ApiTypeKind.Tuple;
}

/**
 * @see ApiTypeLiteralDto in `./api-definitions.ts`.
 */
export interface TypeLiteralTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypeLiteral;
    ReferenceId?: string;
}

/**
 * @see ApiMappedDto in `./api-definitions.ts`.
 */
export interface MappedTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Mapped;
}

/**
 * @see ApiFunctionExpressionDto in `./api-definitions.ts`.
 */
export interface FunctionTypeTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.FunctionType;
}

export interface ThisTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.This;
}

/**
 * @see ApiConstructDto in `./api-definitions.ts`.
 */
export interface ConstructorTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Constructor;
}

/**
 * @example
 * `arg is string`
 */
export interface TypePredicateTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypePredicate;
    ParameterName: string;
    Type: ApiType;
}

/**
 * @example
 * `keyof Foo`
 */
export interface TypeOperatorTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypeOperator;
    Keyword: TypeKeywords.Keyof | TypeKeywords.Unknown;
    Type: ApiType;
}

/**
 * @example
 * `Foo["Name"]`
 */
export interface IndexedAccessTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.IndexedAccess;
    ObjectType: ApiType;
    IndexType: ApiType;
}

/**
 * @example
 * - `(string)`
 * - `(string | undefined)`
 */
export interface ParenthesizedTypeDto extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Parenthesized;
    Type: ApiType;
}

/**
 * @example
 * `typeof Foo`
 */
export interface TypeQueryTypeDto extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.TypeQuery;
    Keyword: TypeKeywords.Typeof;
}
//#endregion
