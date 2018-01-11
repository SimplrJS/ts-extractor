import * as ts from "typescript";
import { ApiItemOptions } from "./abstractions/api-item";
import { ApiHelpers } from "./api-helpers";

export namespace ApiTypeHelpers {
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
        ConstructorType;

    export enum ApiTypeKind {
        Basic = "basic",
        TypeParameter = "type-parameter",
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
        Constructor = "constructor"
    }

    export enum TypeOperator {
        Unknown = "???",
        Keyof = "keyof"
    }

    export interface ApiBaseType {
        ApiTypeKind: ApiTypeKind;
        Text: string;
    }

    export interface ApiMembersBaseType extends ApiBaseType {
        Members: ApiType[];
    }

    export interface ApiReferenceBaseType extends ApiBaseType {
        ReferenceId?: string;
    }

    export interface ApiBasicType extends ApiBaseType {
        ApiTypeKind: ApiTypeKind.Basic | ApiTypeKind.TypeParameter;
    }

    export interface ApiReferenceType extends ApiReferenceBaseType {
        ApiTypeKind: ApiTypeKind.Reference;
        NameText: string;
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
        Operator: TypeOperator;
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

    export function TypeNodeToApiType(typeNode: ts.TypeNode, options: ApiItemOptions, self?: boolean): ApiType {
        if (ts.isTypeReferenceNode(typeNode)) {
            return TypeReferenceNodeToApiType(typeNode, options, self);
        } else if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
            return TypeNodeUnionOrIntersectionToApiType(typeNode, options);
        } else if (ts.isArrayTypeNode(typeNode)) {
            return ArrayTypeNodeToApiType(typeNode, options);
        } else if (ts.isTupleTypeNode(typeNode)) {
            return TupleTypeNodeToApiType(typeNode, options);
        } else if (ts.isTypeLiteralNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(typeNode, options, ApiTypeKind.TypeLiteral) as TypeLiteralType;
        } else if (ts.isMappedTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(typeNode, options, ApiTypeKind.Mapped) as MappedType;
        } else if (ts.isFunctionTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(typeNode, options, ApiTypeKind.FunctionType) as FunctionTypeType;
        } else if (ts.isThisTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(typeNode, options, ApiTypeKind.This) as ThisType;
        } else if (ts.isConstructorTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(typeNode, options, ApiTypeKind.Constructor) as ConstructorType;
        } else if (ts.isTypePredicateNode(typeNode)) {
            return TypePredicateNodeToApiType(typeNode, options);
        } else if (ts.isTypeOperatorNode(typeNode)) {
            return TypeOperatorNodeToApiType(typeNode, options);
        } else if (ts.isIndexedAccessTypeNode(typeNode)) {
            return IndexedAccessTypeNodeToApiType(typeNode, options);
        } else if (ts.isParenthesizedTypeNode(typeNode)) {
            return ParenthesizedTypeNodeToApiType(typeNode, options);
        }

        return TypeNodeToApiBasicType(typeNode, options);
    }

    /**
     * @internal
     */
    export function typeNodeToBaseType(typeNode: ts.TypeNode, options: ApiItemOptions): ApiBaseType {
        const typeChecker = options.Program.getTypeChecker();
        const type = typeChecker.getTypeFromTypeNode(typeNode);
        const text = typeChecker.typeToString(type);

        return {
            ApiTypeKind: ApiTypeKind.Basic,
            Text: text
        };
    }

    export function TypeNodeToApiBasicType(typeNode: ts.TypeNode, options: ApiItemOptions): ApiBasicType {
        // TODO: TypeParameters
        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Basic
        };
    }

    /**
     * Resolving `Definition` reference.
     * @param kind `ApiReferenceBaseType` ApiTypeKind value
     */
    export function ReferenceBaseTypeToTypeDto(
        typeNode: ts.TypeNode,
        options: ApiItemOptions,
        kind: ApiTypeKind
    ): ApiReferenceBaseType {
        const typeChecker = options.Program.getTypeChecker();
        const type = typeChecker.getTypeFromTypeNode(typeNode);
        const symbol = type.getSymbol();
        let referenceId: string | undefined;

        if (symbol != null) {
            referenceId = ApiHelpers.resolveTypeItemReference(symbol, options).referenceId;
        }

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: kind,
            ReferenceId: referenceId
        };
    }

    /**
     * Example `Foo`.
     */
    export function TypeReferenceNodeToApiType(typeNode: ts.TypeReferenceNode, options: ApiItemOptions, self?: boolean): ApiReferenceType {
        const typeChecker = options.Program.getTypeChecker();
        const type = typeChecker.getTypeFromTypeNode(typeNode);

        const nameText = typeNode.typeName.getText();
        let symbolName: string | undefined;
        let typeParameters: ApiType[] | undefined;
        let refenceId: string | undefined;

        if (typeNode.typeArguments != null) {
            typeParameters = typeNode.typeArguments.map(x => TypeNodeToApiType(x, options));
        }

        const symbol = self ? type.getSymbol() : type.aliasSymbol || type.getSymbol();
        if (symbol != null) {
            const { name, referenceId } = ApiHelpers.resolveTypeItemReference(symbol, options);
            refenceId = referenceId;
            symbolName = name;
        }

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Reference,
            NameText: nameText,
            ReferenceId: refenceId,
            TypeParameters: typeParameters,
            SymbolName: symbolName
        };
    }

    /**
     * Example `string | number` or `string & number`.
     */
    export function TypeNodeUnionOrIntersectionToApiType(
        typeNode: ts.UnionTypeNode | ts.IntersectionTypeNode,
        options: ApiItemOptions
    ): ApiUnionOrIntersectionType {
        let apiTypeKind: ApiTypeKind;
        if (ts.isUnionTypeNode(typeNode)) {
            apiTypeKind = ApiTypeKind.Union;
        } else {
            apiTypeKind = ApiTypeKind.Intersection;
        }

        const members = typeNode.types.map(x => TypeNodeToApiType(x, options));

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: apiTypeKind,
            Members: members
        };
    }

    /**
     * Example `string[]`.
     */
    export function ArrayTypeNodeToApiType(typeNode: ts.ArrayTypeNode, options: ApiItemOptions): ArrayType {
        const type = TypeNodeToApiType(typeNode.elementType, options);

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Array,
            Type: type
        };
    }

    /**
     * Example `[string, number]`.
     */
    export function TupleTypeNodeToApiType(typeNode: ts.TupleTypeNode, options: ApiItemOptions): TupleType {
        const members = typeNode.elementTypes.map(x => TypeNodeToApiType(x, options));

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Tuple,
            Members: members
        };
    }

    /**
     * Example `arg is string`.
     */
    export function TypePredicateNodeToApiType(typeNode: ts.TypePredicateNode, options: ApiItemOptions): TypePredicateType {
        const parameterName: string = typeNode.parameterName.getText();
        const type = TypeNodeToApiType(typeNode.type, options);

        // Otherwise text will be "boolean".
        const text = `${parameterName} is ${type.Text}`;

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.TypePredicate,
            ParameterName: parameterName,
            Type: type,
            Text: text
        };
    }

    /**
     * Example `keyof Foo`.
     */
    export function TypeOperatorNodeToApiType(typeNode: ts.TypeOperatorNode, options: ApiItemOptions): TypeOperatorType {
        const type = TypeNodeToApiType(typeNode.type, options);
        let operator: TypeOperator;

        switch (typeNode.operator) {
            case ts.SyntaxKind.KeyOfKeyword: {
                operator = TypeOperator.Keyof;
                break;
            }
            default: {
                operator = TypeOperator.Unknown;
            }
        }

        // Otherwise text will be union.
        const text = `${operator} ${type.Text}`;

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.TypeOperator,
            Operator: operator,
            Type: type,
            Text: text
        };
    }

    /**
     * Example: `Foo[T]`.
     */
    export function IndexedAccessTypeNodeToApiType(typeNode: ts.IndexedAccessTypeNode, options: ApiItemOptions): IndexedAccessType {
        const objectType = TypeNodeToApiType(typeNode.objectType, options);
        const indexType = TypeNodeToApiType(typeNode.indexType, options);

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.IndexedAccess,
            ObjectType: objectType,
            IndexType: indexType
        };
    }

    /**
     * Example: `(string | number)`.
     */
    export function ParenthesizedTypeNodeToApiType(typeNode: ts.ParenthesizedTypeNode, options: ApiItemOptions): ParenthesizedType {
        const type = TypeNodeToApiType(typeNode.type, options);

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Parenthesized,
            Type: type
        };
    }
}
