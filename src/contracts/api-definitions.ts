import * as ts from "typescript";
import { AccessModifier } from "./access-modifier";
import { ApiItemReference } from "./api-item-reference";
import { ApiType } from "./api-types";
import { ApiMetadataDto } from "./api-metadata-dto";
import { ApiItemLocationDto } from "./api-item-location-dto";

export enum ApiDefinitionKind {
    SourceFile = "source-file",
    Enum = "enum",
    EnumMember = "enum-member",
    Function = "function",
    Interface = "interface",
    Method = "method",
    Namespace = "namespace",
    ImportNamespace = "import-namespace",
    Parameter = "parameter",
    Property = "property",
    Variable = "variable",
    TypeAlias = "type-alias",
    Class = "class",
    ClassProperty = "class-property",
    ClassMethod = "class-method",
    GetAccessor = "get-accessor",
    SetAccessor = "set-accessor",
    Index = "index",
    Call = "call",
    ClassConstructor = "class-constructor",
    Construct = "construct",
    ConstructorType = "constructor-type",
    Export = "export",
    ExportSpecifier = "export-specifier",
    ImportSpecifier = "import-specifier",
    TypeParameter = "type-parameter",
    TypeLiteral = "type-literal",
    ObjectLiteral = "object-literal",
    FunctionType = "function-type",
    ArrowFunction = "arrow-function",
    FunctionExpression = "function-expression",
    Mapped = "mapped"
}

export type ApiDefinition = ApiCallDto |
    ApiClassConstructorDto |
    ApiClassDto |
    ApiClassMethodDto |
    ApiClassPropertyDto |
    ApiConstructDto |
    ApiEnumDto |
    ApiEnumMemberDto |
    ApiExportDto |
    ApiExportSpecifierDto |
    ApiImportSpecifierDto |
    ApiFunctionDto |
    ApiFunctionExpressionDto |
    ApiIndexDto |
    ApiInterfaceDto |
    ApiMethodDto |
    ApiNamespaceDto |
    ApiParameterDto |
    ApiPropertyDto |
    ApiSourceFileDto |
    ApiTypeAliasDto |
    ApiTypeLiteralDto |
    ApiTypeParameterDto |
    ApiVariableDto |
    ApiGetAccessorDto |
    ApiSetAccessorDto |
    ApiMappedDto;

export interface TypeScriptTypeDeclarationDebug {
    Kind: ts.SyntaxKind;
    KindString: string;
}

//#region Base interfaces

/**
 * This is the interface for definitions like: interface, class or enum etc.
 */
export interface ApiBaseItemDto {
    Name: string;
    ApiKind: ApiDefinitionKind;
    Metadata: ApiMetadataDto;
    Location: ApiItemLocationDto;
    /**
     * Parent reference id.
     */
    ParentId: string | undefined;
    /**
     * TypeScript debug info.
     */
    _ts?: TypeScriptTypeDeclarationDebug;
}

//#endregion
//#region Definitions

export interface ApiCallableDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReference[];
    Parameters: ApiItemReference[];
    IsOverloadBase: boolean;
    ReturnType?: ApiType;
}

export interface ApiSourceFileDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.SourceFile;
    Members: ApiItemReference[];
}

export interface ApiCallDto extends ApiCallableDto {
    ApiKind: ApiDefinitionKind.Call;
}

export interface ApiClassDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Class;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends?: ApiType;
    Implements: ApiType[];
    IsAbstract: boolean;
}

export interface ApiClassConstructorDto extends ApiCallableDto {
    ApiKind: ApiDefinitionKind.ClassConstructor;
    AccessModifier: AccessModifier;
}

export interface ApiClassMethodDto extends ApiCallableDto {
    ApiKind: ApiDefinitionKind.ClassMethod;
    AccessModifier: AccessModifier;
    IsOptional: boolean;
    IsAbstract: boolean;
    IsAsync: boolean;
    IsStatic: boolean;
}

export interface ApiClassPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.ClassProperty;
    AccessModifier: AccessModifier;
    IsAbstract: boolean;
    IsStatic: boolean;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}

export interface ApiConstructDto extends ApiCallableDto {
    ApiKind: ApiDefinitionKind.Construct | ApiDefinitionKind.ConstructorType;
}

export interface ApiEnumDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Enum;
    IsConst: boolean;
    Members: ApiItemReference[];
}

export interface ApiEnumMemberDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.EnumMember;
    Value: string;
}

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Export;
    SourceFileId: string | undefined;
    ExportPath: string | undefined;
}

export type ApiExportSpecifierApiItems = string[] | undefined;

export interface ApiExportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.ExportSpecifier;
    ApiItems: ApiExportSpecifierApiItems;
}

export interface ApiFunctionDto extends ApiCallableDto {
    ApiKind: ApiDefinitionKind.Function;
    IsAsync: boolean;
}

export interface ApiFunctionExpressionDto extends ApiCallableDto {
    ApiKind: ApiDefinitionKind.FunctionType | ApiDefinitionKind.ArrowFunction | ApiDefinitionKind.FunctionExpression;
}

export interface ApiGetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.GetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Type: ApiType;
}

export interface ApiSetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.SetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Parameter: ApiItemReference | undefined;
}

export type ApiImportSpecifierApiItems = string[] | undefined;

export interface ApiImportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.ImportSpecifier;
    ApiItems: ApiImportSpecifierApiItems;
}

export interface ApiIndexDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Index;
    Parameter: string;
    IsReadonly: boolean;
    Type: ApiType;
}

export interface ApiInterfaceDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Interface;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends: ApiType[];
}

export interface ApiMappedDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Mapped;
    TypeParameter: string | undefined;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}

export interface ApiMethodDto extends ApiCallableDto {
    ApiKind: ApiDefinitionKind.Method;
    IsOptional: boolean;
}

export interface ApiNamespaceDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Namespace | ApiDefinitionKind.ImportNamespace;
    Members: ApiItemReference[];
}

export interface ApiParameterDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Parameter;
    Type: ApiType;
    IsSpread: boolean;
    Initializer: string | undefined;
    IsOptional: boolean;
}

export interface ApiPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Property;
    IsOptional: boolean;
    IsReadonly: boolean;
    Type: ApiType;
}

export interface ApiTypeAliasDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.TypeAlias;
    TypeParameters: ApiItemReference[];
    Type: ApiType;
}

export interface ApiTypeLiteralDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.TypeLiteral | ApiDefinitionKind.ObjectLiteral;
    Members: ApiItemReference[];
}

export interface ApiTypeParameterDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.TypeParameter;
    ConstraintType: ApiType | undefined;
    DefaultType: ApiType | undefined;
}

export enum ApiVariableDeclarationType {
    Var = "var",
    Let = "let",
    Const = "const"
}

export interface ApiVariableDto extends ApiBaseItemDto {
    ApiKind: ApiDefinitionKind.Variable;
    Type: ApiType;
    VariableDeclarationType: ApiVariableDeclarationType;
}

//#endregion
