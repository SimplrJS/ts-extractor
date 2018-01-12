import * as ts from "typescript";

export type ApiType = ApiBasicType |
    ApiReferenceType |
    ApiUnionOrIntersectionType |
    ArrayType |
    TupleType |
    TypeLiteralType |
    MappedType |
    FunctionTypeType |
    ThisType |
    TypePredicateType |
    TypeOperatorType |
    IndexedAccessType |
    ParenthesizedType |
    ConstructorType |
    TypeQueryType;

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

export interface ApiBaseType {
    ApiTypeKind: ApiTypeKind;
    Text: string;
    _ts?: TypeScriptTypeNodeDebug;
}

export interface ApiMembersBaseType extends ApiBaseType {
    Members: ApiType[];
}

export interface ApiReferenceBaseType extends ApiBaseType {
    ReferenceId?: string;
}

export interface ApiBasicType extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Basic;
}

export interface ApiReferenceType extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Reference;
    TypeParameters: ApiType[] | undefined;
    SymbolName?: string;
}

export interface ApiUnionOrIntersectionType extends ApiMembersBaseType {
    ApiTypeKind: ApiTypeKind.Intersection | ApiTypeKind.Union;
}

export interface ArrayType extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Array;
    Type: ApiType;
}

export interface TupleType extends ApiMembersBaseType {
    ApiTypeKind: ApiTypeKind.Tuple;
}

export interface TypeLiteralType extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypeLiteral;
    ReferenceId?: string;
}

export interface MappedType extends ApiBaseType, ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Mapped;
}

export interface FunctionTypeType extends ApiBaseType, ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Mapped;
}

export interface ThisType extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.This;
}

export interface ConstructorType extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.Constructor;
}

export interface TypePredicateType extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypePredicate;
    ParameterName: string;
    Type: ApiType;
}

export interface TypeOperatorType extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.TypeOperator;
    Keyword: TypeKeywords.Keyof | TypeKeywords.Unknown;
    Type: ApiType;
}

export interface IndexedAccessType extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.IndexedAccess;
    ObjectType: ApiType;
    IndexType: ApiType;
}

export interface ParenthesizedType extends ApiBaseType {
    ApiTypeKind: ApiTypeKind.Parenthesized;
    Type: ApiType;
}

export interface TypeQueryType extends ApiReferenceBaseType {
    ApiTypeKind: ApiTypeKind.TypeQuery;
    Keyword: TypeKeywords.Typeof;
}
