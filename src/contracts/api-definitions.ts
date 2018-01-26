import { ApiItemKind } from "./api-item-kind";
import { ApiCallableDto } from "./api-callable-dto";
import { AccessModifier } from "./access-modifier";
import { ApiBaseItemDto } from "./api-base-item-dto";
import { ApiItemReference } from "./api-item-reference";
import { ApiType } from "./api-types";

export interface ApiSourceFileDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.SourceFile;
    Members: ApiItemReference[];
}

export interface ApiCallDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Call;
}

export interface ApiClassDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Class;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends?: ApiType;
    Implements: ApiType[];
    IsAbstract: boolean;
}

export interface ApiClassConstructorDto extends ApiCallableDto {
    ApiKind: ApiItemKind.ClassConstructor;
    AccessModifier: AccessModifier;
}

export interface ApiClassMethodDto extends ApiCallableDto {
    ApiKind: ApiItemKind.ClassMethod;
    AccessModifier: AccessModifier;
    IsOptional: boolean;
    IsAbstract: boolean;
    IsAsync: boolean;
    IsStatic: boolean;
}

export interface ApiClassPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.ClassProperty;
    AccessModifier: AccessModifier;
    IsAbstract: boolean;
    IsStatic: boolean;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}

export interface ApiConstructDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Construct | ApiItemKind.ConstructorType;
}

export interface ApiEnumDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Enum;
    IsConst: boolean;
    Members: ApiItemReference[];
}

export interface ApiEnumMemberDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.EnumMember;
    Value: string;
}

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Export;
    SourceFileId: string | undefined;
    ExportPath: string | undefined;
}

export type ApiExportSpecifierApiItems = string[] | undefined;

export interface ApiExportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.ExportSpecifier;
    ApiItems: ApiExportSpecifierApiItems;
}

export interface ApiFunctionDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Function;
    IsAsync: boolean;
}

export interface ApiFunctionExpressionDto extends ApiCallableDto {
    ApiKind: ApiItemKind.FunctionType | ApiItemKind.ArrowFunction | ApiItemKind.FunctionExpression;
}

export interface ApiGetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.GetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Type: ApiType;
}

export interface ApiSetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.SetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Parameter: ApiItemReference | undefined;
}

export type ApiImportSpecifierApiItems = string[] | undefined;

export interface ApiImportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.ImportSpecifier;
    ApiItems: ApiImportSpecifierApiItems;
}

export interface ApiIndexDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Index;
    Parameter: string;
    IsReadonly: boolean;
    Type: ApiType;
}

export interface ApiInterfaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Interface;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends: ApiType[];
}

export interface ApiMappedDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Mapped;
    TypeParameter: string | undefined;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}

export interface ApiMethodDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Method;
    IsOptional: boolean;
}

export interface ApiNamespaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Namespace | ApiItemKind.ImportNamespace;
    Members: ApiItemReference[];
}

export interface ApiParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Parameter;
    Type: ApiType;
    IsSpread: boolean;
    Initializer: string | undefined;
    IsOptional: boolean;
}

export interface ApiPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Property;
    IsOptional: boolean;
    IsReadonly: boolean;
    Type: ApiType;
}

export interface ApiTypeAliasDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.TypeAlias;
    TypeParameters: ApiItemReference[];
    Type: ApiType;
}

export interface ApiTypeLiteralDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.TypeLiteral | ApiItemKind.ObjectLiteral;
    Members: ApiItemReference[];
}

export interface ApiTypeParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.TypeParameter;
    ConstraintType: ApiType | undefined;
    DefaultType: ApiType | undefined;
}

export enum ApiVariableDeclarationType {
    Var = "var",
    Let = "let",
    Const = "const"
}

export interface ApiVariableDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Variable;
    Type: ApiType;
    VariableDeclarationType: ApiVariableDeclarationType;
}
