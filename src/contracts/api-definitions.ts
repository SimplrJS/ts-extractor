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
export interface ApiBaseDefinition {
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

export interface ApiCallableBaseDefinition extends ApiBaseDefinition {
    TypeParameters: ApiItemReference[];
    Parameters: ApiItemReference[];
    IsOverloadBase: boolean;
    ReturnType?: ApiType;
}

//#endregion
//#region Definitions
/**
 * Source file that contains all exported definitions.
 * Usually an entry file.
 */
export interface ApiSourceFileDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.SourceFile;
    Members: ApiItemReference[];
}

/**
 * Example:
 * ```ts
 * interface Example {
 *    (arg: string): string;
 * }
 * ```
 */
export interface ApiCallDto extends ApiCallableBaseDefinition {
    ApiKind: ApiDefinitionKind.Call;
}

/**
 * Example:
 * ```ts
 * class Foo<TValue> extends AnotherClass implements BaseInterface { }
 * ```
 */
export interface ApiClassDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Class;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends?: ApiType;
    Implements: ApiType[];
    IsAbstract: boolean;
}

/**
 * Example:
 * ```ts
 * class Example {
 *  constructor(arg: string) {}
 * }
 * ```
 */
export interface ApiClassConstructorDto extends ApiCallableBaseDefinition {
    ApiKind: ApiDefinitionKind.ClassConstructor;
    AccessModifier: AccessModifier;
}

/**
 * Example:
 * ```ts
 * class Example {
 *  public Render(): void {}
 * }
 * ```
 */
export interface ApiClassMethodDto extends ApiCallableBaseDefinition {
    ApiKind: ApiDefinitionKind.ClassMethod;
    AccessModifier: AccessModifier;
    IsOptional: boolean;
    IsAbstract: boolean;
    IsAsync: boolean;
    IsStatic: boolean;
}

/**
 * Example:
 * ```ts
 * class Example {
 *  public Property: string = "Hello World!";
 * }
 * ```
 */
export interface ApiClassPropertyDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.ClassProperty;
    AccessModifier: AccessModifier;
    IsAbstract: boolean;
    IsStatic: boolean;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}

/**
 * Example:
 * ```ts
 * interface Foo {
 *  Name: string;
 * }
 *
 * interface FooConstructor {
 *  new (): Foo;
 * }
 * ```
 */
export interface ApiConstructDto extends ApiCallableBaseDefinition {
    ApiKind: ApiDefinitionKind.Construct | ApiDefinitionKind.ConstructorType;
}

/**
 * Example:
 * ```ts
 * enum Foo {}
 * ```
 */
export interface ApiEnumDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Enum;
    IsConst: boolean;
    Members: ApiItemReference[];
}

/**
 * Examples:
 * ```ts
 * // Without specifying value
 * enum Example {
 *  None,
 *  Error,
 *  Warning
 * }
 *
 * // Specifying number value
 * enum Example {
 *  None = 0,
 *  Error = 8,
 *  Warning = 16
 * }
 *
 * // Specifying string value
 * enum Example {
 *  None = "none",
 *  Error = "error",
 *  Warning = "warning"
 * }
 * ```
 */
export interface ApiEnumMemberDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.EnumMember;
    Value: string;
}

/**
 * Example:
 * ```ts
 * export * as Foo from "./foo";
 * ```
 */
export interface ApiExportDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Export;
    SourceFileId: string | undefined;
    ExportPath: string | undefined;
}

export type ApiExportSpecifierApiItems = string[] | undefined;

/**
 * Example:
 * ```ts
 * export { Foo } from "./foo";
 * ```
 */
export interface ApiExportSpecifierDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.ExportSpecifier;
    ApiItems: ApiExportSpecifierApiItems;
}

/**
 * Example:
 * ```ts
 * function Foo(arg: string): void {}
 * ```
 */
export interface ApiFunctionDto extends ApiCallableBaseDefinition {
    ApiKind: ApiDefinitionKind.Function;
    IsAsync: boolean;
}

/**
 * Examples:
 * ```ts
 * // Function expression
 * const foo = function(arg: string): void {};
 *
 * // Arrow function
 * const foo = (arg: string): void => {};
 *
 * // Function type
 * const foo: (arg: string) => void;
 * ```
 */
export interface ApiFunctionExpressionDto extends ApiCallableBaseDefinition {
    ApiKind: ApiDefinitionKind.FunctionExpression | ApiDefinitionKind.FunctionType | ApiDefinitionKind.ArrowFunction;
}

/**
 * Examples:
 * ```ts
 * class Example {
 *  public get Foo(): string {
 *      return "Hello World";
 *  }
 * }
 * ```
 */
export interface ApiGetAccessorDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.GetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Type: ApiType;
}

/**
 * Examples:
 * ```ts
 * class Example {
 *  private foo: string;
 *
 *  public set Foo(arg: string) {
 *      this.foo = arg;
 *  }
 * }
 * ```
 */
export interface ApiSetAccessorDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.SetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Parameter: ApiItemReference | undefined;
}

export type ApiImportSpecifierApiItems = string[] | undefined;

/**
 * Examples:
 * ```ts
 * import { Foo } from "./foo";
 * ```
 */
export interface ApiImportSpecifierDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.ImportSpecifier;
    ApiItems: ApiImportSpecifierApiItems;
}

/**
 * Examples:
 * ```ts
 * interface Example {
 *  [key: string]: string;
 * }
 * ```
 */
export interface ApiIndexDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Index;
    Parameter: string;
    IsReadonly: boolean;
    Type: ApiType;
}

/**
 * Examples:
 * ```ts
 * interface Foo<TValue> extends OtherInterface<TValue> {}
 * ```
 */
export interface ApiInterfaceDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Interface;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends: ApiType[];
}

/**
 * Examples:
 * ```ts
 * interface Bar {
 *  Name: string;
 * }
 *
 * type Foo = {
 *  readonly [T in keyof Bar]: Bar[T]
 * };
 * ```
 */
export interface ApiMappedDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Mapped;
    TypeParameter: string | undefined;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}

/**
 * Examples:
 * ```ts
 * interface Foo {
 *  Bar(): string;
 * }
 * ```
 */
export interface ApiMethodDto extends ApiCallableBaseDefinition {
    ApiKind: ApiDefinitionKind.Method;
    IsOptional: boolean;
}

/**
 * Examples:
 * ```ts
 * namespace Foo {}
 * ```
 */
export interface ApiNamespaceDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Namespace | ApiDefinitionKind.ImportNamespace;
    Members: ApiItemReference[];
}

/**
 * Examples:
 * ```ts
 * function Foo(parameter: string): void {}
 * ```
 */
export interface ApiParameterDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Parameter;
    Type: ApiType;
    IsSpread: boolean;
    Initializer: string | undefined;
    IsOptional: boolean;
}

/**
 * Examples:
 * ```ts
 * interface Example {
 *  Foo: string;
 * }
 * ```
 */
export interface ApiPropertyDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Property;
    IsOptional: boolean;
    IsReadonly: boolean;
    Type: ApiType;
}

/**
 * Examples:
 * ```ts
 * type StringAlias = string;
 * ```
 */
export interface ApiTypeAliasDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.TypeAlias;
    TypeParameters: ApiItemReference[];
    Type: ApiType;
}

/**
 * Examples:
 * ```ts
 * // Type literal
 * type TypeLiteral = {
 *  Name: string;
 * };
 *
 * // Object literal
 * const a = {
 *  Name: "Bob"
 * };
 * ```
 */
export interface ApiTypeLiteralDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.TypeLiteral | ApiDefinitionKind.ObjectLiteral;
    Members: ApiItemReference[];
}

/**
 * Examples:
 * ```ts
 * interface Foo<TTypeParameter> {}
 * ```
 */
export interface ApiTypeParameterDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.TypeParameter;
    ConstraintType: ApiType | undefined;
    DefaultType: ApiType | undefined;
}

export enum ApiVariableDeclarationType {
    Var = "var",
    Let = "let",
    Const = "const"
}

/**
 * Examples:
 * ```ts
 * var foo = "Hello World";
 * let foo = "Hello World";
 * const foo = "Hello World";
 * ```
 */
export interface ApiVariableDto extends ApiBaseDefinition {
    ApiKind: ApiDefinitionKind.Variable;
    Type: ApiType;
    VariableDeclarationType: ApiVariableDeclarationType;
}
//#endregion
