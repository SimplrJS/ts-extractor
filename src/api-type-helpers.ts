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
        FunctionTypeType;

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
        FunctionType = "function-type"
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

    export function ArrayTypeNodeToApiType(typeNode: ts.ArrayTypeNode, options: ApiItemOptions): ArrayType {
        const type = TypeNodeToApiType(typeNode.elementType, options);

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Array,
            Type: type
        };
    }

    export function TupleTypeNodeToApiType(typeNode: ts.TupleTypeNode, options: ApiItemOptions): TupleType {
        const members = typeNode.elementTypes.map(x => TypeNodeToApiType(x, options));

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Tuple,
            Members: members
        };
    }
}
