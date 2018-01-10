import * as ts from "typescript";
import { ApiItemOptions } from "./abstractions/api-item";
import { ApiHelpers } from "./api-helpers";

export namespace ApiTypeHelpers {
    export type ApiType = ApiBasicType |
        ApiReferenceType |
        ApiUnionOrIntersectionType |
        ArrayType;

    export enum ApiTypeKind {
        Basic = "basic",
        TypeParameter = "type-parameter",
        Reference = "reference",
        Union = "union",
        Intersection = "intersection",
        Array = "array"
    }

    export interface ApiBaseType {
        ApiTypeKind: ApiTypeKind;
        Text: string;
    }

    export interface ApiMembersBaseType {
        Members: ApiType[];
    }

    export interface ApiBasicType extends ApiBaseType {
        ApiTypeKind: ApiTypeKind.Basic | ApiTypeKind.TypeParameter;
    }

    export interface ApiReferenceType extends ApiBaseType {
        ApiTypeKind: ApiTypeKind.Reference;
        NameText: string;
        TypeParameters: ApiType[] | undefined;
        SymbolName?: string;
        ReferenceId?: string;
    }

    export interface ApiUnionOrIntersectionType extends ApiBaseType, ApiMembersBaseType {
        ApiTypeKind: ApiTypeKind.Intersection | ApiTypeKind.Union;
    }

    export interface ArrayType extends ApiBaseType {
        ApiTypeKind: ApiTypeKind.Array;
        Type: ApiType;
    }

    export function TypeNodeToTypeDto(typeNode: ts.TypeNode, options: ApiItemOptions, self?: boolean): ApiType {
        if (ts.isTypeReferenceNode(typeNode)) {
            return TypeReferenceNodeToTypeDto(typeNode, options, self);
        } else if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
            return TypeNodeUnionOrIntersectionToTypeDto(typeNode, options);
        } else if (ts.isArrayTypeNode(typeNode)) {
            return ArrayTypeNodeToTypeDto(typeNode, options);
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

    export function TypeReferenceNodeToTypeDto(typeNode: ts.TypeReferenceNode, options: ApiItemOptions, self?: boolean): ApiReferenceType {
        const typeChecker = options.Program.getTypeChecker();
        const type = typeChecker.getTypeFromTypeNode(typeNode);

        const nameText = typeNode.typeName.getText();
        let symbolName: string | undefined;
        let typeParameters: ApiType[] | undefined;
        let refenceId: string | undefined;

        if (typeNode.typeArguments != null) {
            typeParameters = typeNode.typeArguments.map(x => TypeNodeToTypeDto(x, options));
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

    export function TypeNodeUnionOrIntersectionToTypeDto(
        typeNode: ts.UnionTypeNode | ts.IntersectionTypeNode,
        options: ApiItemOptions
    ): ApiUnionOrIntersectionType {
        let apiTypeKind: ApiTypeKind;
        if (ts.isUnionTypeNode(typeNode)) {
            apiTypeKind = ApiTypeKind.Union;
        } else {
            apiTypeKind = ApiTypeKind.Intersection;
        }

        const members = typeNode.types.map(x => TypeNodeToTypeDto(x, options));

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: apiTypeKind,
            Members: members
        };
    }

    export function ArrayTypeNodeToTypeDto(typeNode: ts.ArrayTypeNode, options: ApiItemOptions): any {
        const type = TypeNodeToTypeDto(typeNode.elementType, options);

        return {
            ...typeNodeToBaseType(typeNode, options),
            ApiTypeKind: ApiTypeKind.Array,
            Type: type
        };
    }
}
