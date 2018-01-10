import * as ts from "typescript";
import { ApiItemOptions } from "./abstractions/api-item";
import { ApiHelpers } from "./index";

export namespace ApiTypeHelpers {
    export type ApiType = ApiReferenceType | any;

    export enum ApiTypeKind {
        Basic = "basic",
        Reference = "reference",
        Union = "union",
        Intersection = "intersection"
    }

    export interface ApiBaseType {
        ApiTypeKind: ApiTypeKind;
        Text: string;
    }

    export interface ApiMembersBaseType {
        Members: ApiType[];
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

    export function TypeNodeToTypeDto(typeNode: ts.TypeNode, options: ApiItemOptions, self?: boolean): ApiType {
        if (ts.isTypeReferenceNode(typeNode)) {
            return TypeReferenceNodeToTypeDto(typeNode, options, self);
        } else if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
            return TypeNodeUnionOrIntersectionToTypeDto(typeNode, options);
        }
    }

    export function TypeNodeToBaseType(typeNode: ts.TypeNode, options: ApiItemOptions): ApiBaseType {
        const typeChecker = options.Program.getTypeChecker();
        const type = typeChecker.getTypeFromTypeNode(typeNode);
        const text = typeChecker.typeToString(type);

        return {
            ApiTypeKind: ApiTypeKind.Basic,
            Text: text
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
            ...TypeNodeToBaseType(typeNode, options),
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

        const members = typeNode.types.map(x => TypeNodeToTypeDto(typeNode, options));

        return {
            ...TypeNodeToBaseType(typeNode, options),
            ApiTypeKind: apiTypeKind,
            Members: members
        };
    }
}
