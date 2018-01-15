import * as ts from "typescript";
import { ApiItemOptions } from "./abstractions/api-item";
import { ApiHelpers } from "./api-helpers";
import { TSHelpers } from "./index";
import {
    ApiType,
    TypeLiteralType,
    ApiTypeKind,
    MappedType,
    FunctionTypeType,
    ThisType,
    ConstructorType,
    ApiBaseType,
    ApiBasicType,
    ApiReferenceBaseType,
    ApiReferenceType,
    ApiUnionOrIntersectionType,
    IndexedAccessType,
    ArrayType,
    ParenthesizedType,
    TupleType,
    TypeOperatorType,
    TypePredicateType,
    TypeQueryType,
    TypeKeywords
} from "./contracts/api-type";

export namespace ApiTypeHelpers {
    export function ResolveApiType(options: ApiItemOptions, type: ts.Type, typeNode?: ts.TypeNode, self?: boolean): ApiType {
        const typeChecker = options.Program.getTypeChecker();

        if (typeNode == null) {
            typeNode = typeChecker.typeToTypeNode(type);
        }

        if (ts.isTypeReferenceNode(typeNode) || ts.isExpressionWithTypeArguments(typeNode)) {
            return TypeReferenceNodeToApiType(options, type, typeNode, self);
        } else if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
            return TypeNodeUnionOrIntersectionToApiType(options, type as ts.UnionOrIntersectionType, typeNode);
        } else if (ts.isArrayTypeNode(typeNode)) {
            return ArrayTypeNodeToApiType(options, type, typeNode);
        } else if (ts.isTupleTypeNode(typeNode)) {
            return TupleTypeNodeToApiType(options, type, typeNode);
        } else if (ts.isTypeLiteralNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, type, typeNode, ApiTypeKind.TypeLiteral) as TypeLiteralType;
        } else if (ts.isMappedTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, type, typeNode, ApiTypeKind.Mapped) as MappedType;
        } else if (ts.isFunctionTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, type, typeNode, ApiTypeKind.FunctionType) as FunctionTypeType;
        } else if (ts.isThisTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, type, typeNode, ApiTypeKind.This) as ThisType;
        } else if (ts.isConstructorTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, type, typeNode, ApiTypeKind.Constructor) as ConstructorType;
        } else if (ts.isTypePredicateNode(typeNode)) {
            return TypePredicateNodeToApiType(options, type, typeNode);
        } else if (ts.isTypeOperatorNode(typeNode)) {
            return TypeOperatorNodeToApiType(options, type, typeNode);
        } else if (ts.isIndexedAccessTypeNode(typeNode)) {
            return IndexedAccessTypeNodeToApiType(options, type, typeNode);
        } else if (ts.isParenthesizedTypeNode(typeNode)) {
            return ParenthesizedTypeNodeToApiType(options, type, typeNode);
        } else if (ts.isTypeQueryNode(typeNode)) {
            return TypeQueryToApiType(options, type, typeNode);
        }

        return ResolveApiBasicType(options, type, typeNode);
    }

    /**
     * @internal
     */
    export function typeNodeToBaseType(options: ApiItemOptions, type: ts.Type, typeNode: ts.TypeNode): ApiBaseType {
        const typeChecker = options.Program.getTypeChecker();
        const text = typeChecker.typeToString(type);

        const result: ApiBaseType = {
            ApiTypeKind: ApiTypeKind.Basic,
            Text: text
        };

        if (options.ExtractorOptions.IncludeTsDebugInfo) {
            result._ts = {
                Kind: typeNode.kind,
                KindString: ts.SyntaxKind[typeNode.kind]
            };
        }

        return result;
    }

    /**
     * @internal
     */
    export interface ResolvedTypeItemReference {
        name?: string;
        referenceId?: string;
    }

    /**
     * @internal
     */
    export function resolveTypeItemReference(symbol: ts.Symbol, options: ApiItemOptions): ResolvedTypeItemReference {
        if (symbol.declarations != null && symbol.declarations.length > 0) {
            const declaration: ts.Declaration = symbol.declarations[0];

            return {
                name: symbol.getName(),
                referenceId: ApiHelpers.GetItemId(declaration, symbol, options)
            };
        }

        return {
            name: symbol.getName()
        };
    }

    export function ResolveApiBasicType(options: ApiItemOptions, type: ts.Type, typeNode: ts.TypeNode): ApiBasicType {
        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.Basic
        };
    }

    /**
     * Resolving `Definition` reference.
     * @param kind `ApiReferenceBaseType` ApiTypeKind value
     */
    export function ReferenceBaseTypeToTypeDto(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.TypeNode,
        kind?: ApiTypeKind
    ): ApiReferenceBaseType {
        const symbol = type.getSymbol();
        let referenceId: string | undefined;

        if (symbol != null) {
            referenceId = resolveTypeItemReference(symbol, options).referenceId;
        }

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: kind || ApiTypeKind.Basic,
            ReferenceId: referenceId
        };
    }

    /**
     * Example `Foo`.
     */
    export function TypeReferenceNodeToApiType(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.TypeReferenceType,
        self?: boolean
    ): ApiReferenceType {
        const typeChecker = options.Program.getTypeChecker();

        let symbolName: string | undefined;
        let typeParameters: ApiType[] | undefined;
        let refenceId: string | undefined;

        if (!TSHelpers.IsNodeSynthesized(typeNode) && typeNode.typeArguments != null) {
            typeParameters = typeNode.typeArguments
                .map(x => ResolveApiType(options, typeChecker.getTypeFromTypeNode(x), x));
        } else if (TSHelpers.IsTypeWithTypeArguments(type)) {
            typeParameters = type.typeArguments
                .map(x => ResolveApiType(options, x, typeChecker.typeToTypeNode(x)));
        }

        const symbol = self ? type.getSymbol() : type.aliasSymbol || type.getSymbol();
        if (symbol != null) {
            const { name, referenceId } = resolveTypeItemReference(symbol, options);
            refenceId = referenceId;
            symbolName = name;
        }

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.Reference,
            ReferenceId: refenceId,
            TypeParameters: typeParameters,
            SymbolName: symbolName
        };
    }

    /**
     * Example `string | number` or `string & number`.
     */
    export function TypeNodeUnionOrIntersectionToApiType(
        options: ApiItemOptions,
        type: ts.UnionOrIntersectionType,
        typeNode: ts.UnionTypeNode | ts.IntersectionTypeNode
    ): ApiUnionOrIntersectionType {
        const typeChecker = options.Program.getTypeChecker();

        let apiTypeKind: ApiTypeKind;
        if (ts.isUnionTypeNode(typeNode)) {
            apiTypeKind = ApiTypeKind.Union;
        } else {
            apiTypeKind = ApiTypeKind.Intersection;
        }

        let members: ApiType[];
        if (!TSHelpers.IsNodeSynthesized(typeNode)) {
            members = typeNode.types
                .map(x => ResolveApiType(options, typeChecker.getTypeFromTypeNode(x), x));
        } else {
            members = type.types
                .map(x => ResolveApiType(options, x, typeChecker.typeToTypeNode(x)));
        }

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: apiTypeKind,
            Members: members
        };
    }

    /**
     * Example `string[]`.
     */
    export function ArrayTypeNodeToApiType(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.ArrayTypeNode
    ): ArrayType {
        const typeChecker = options.Program.getTypeChecker();

        let apiType: ApiType;
        if (!TSHelpers.IsNodeSynthesized(typeNode)) {
            apiType = ResolveApiType(options, typeChecker.getTypeFromTypeNode(typeNode.elementType), typeNode.elementType);
        } else if (TSHelpers.IsTypeWithTypeArguments(type)) {
            const arrayType = type.typeArguments[0];
            apiType = ResolveApiType(options, arrayType, typeChecker.typeToTypeNode(arrayType));
        } else {
            // TODO: Log Error.
            apiType = ResolveApiType(options, typeChecker.getTypeFromTypeNode(typeNode.elementType), typeNode.elementType);
        }

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.Array,
            Type: apiType
        };
    }

    /**
     * Example `[string, number]`.
     */
    export function TupleTypeNodeToApiType(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.TupleTypeNode
    ): TupleType {
        const typeChecker = options.Program.getTypeChecker();

        let members: ApiType[];
        if (!TSHelpers.IsNodeSynthesized(typeNode)) {
            members = typeNode.elementTypes
                .map(x => ResolveApiType(options, typeChecker.getTypeFromTypeNode(x), x));
        } else if (TSHelpers.IsTypeWithTypeArguments(type)) {
            members = type.typeArguments.map(x => ResolveApiType(options, x, typeChecker.typeToTypeNode(x)));
        } else {
            // TODO: Log Error.
            members = [];
        }

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.Tuple,
            Members: members
        };
    }

    /**
     * Example `arg is string`.
     */
    export function TypePredicateNodeToApiType(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.TypePredicateNode
    ): TypePredicateType {
        const typeChecker = options.Program.getTypeChecker();
        const parameterName: string = typeNode.parameterName.getText();
        const apiType = ResolveApiType(options, typeChecker.getTypeFromTypeNode(typeNode.type), typeNode.type);

        // Otherwise text will be "boolean".
        const text = `${parameterName} is ${apiType.Text}`;

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.TypePredicate,
            ParameterName: parameterName,
            Type: apiType,
            Text: text
        };
    }

    /**
     * Example `keyof Foo`.
     */
    export function TypeOperatorNodeToApiType(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.TypeOperatorNode
    ): TypeOperatorType {
        const typeChecker = options.Program.getTypeChecker();
        const apiType = ResolveApiType(options, typeChecker.getTypeFromTypeNode(typeNode.type), typeNode.type);
        let operator: TypeKeywords;

        switch (typeNode.operator) {
            case ts.SyntaxKind.KeyOfKeyword: {
                operator = TypeKeywords.Keyof;
                break;
            }
            default: {
                operator = TypeKeywords.Unknown;
            }
        }

        // Otherwise text will be union.
        const text = `${operator} ${apiType.Text}`;

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.TypeOperator,
            Keyword: operator,
            Type: apiType,
            Text: text
        };
    }

    /**
     * Example: `Foo[T]`.
     */
    export function IndexedAccessTypeNodeToApiType(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.IndexedAccessTypeNode
    ): IndexedAccessType {
        const typeChecker = options.Program.getTypeChecker();
        const objectApiType = ResolveApiType(options, typeChecker.getTypeFromTypeNode(typeNode.objectType), typeNode.objectType);
        const indexApiType = ResolveApiType(options, typeChecker.getTypeFromTypeNode(typeNode.indexType), typeNode.indexType);

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.IndexedAccess,
            ObjectType: objectApiType,
            IndexType: indexApiType
        };
    }

    /**
     * Example: `(string | number)`.
     */
    export function ParenthesizedTypeNodeToApiType(
        options: ApiItemOptions,
        type: ts.Type,
        typeNode: ts.ParenthesizedTypeNode
    ): ParenthesizedType {
        const typeChecker = options.Program.getTypeChecker();
        const apiType = ResolveApiType(options, typeChecker.getTypeFromTypeNode(typeNode.type), typeNode.type);

        return {
            ...typeNodeToBaseType(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.Parenthesized,
            Type: apiType
        };
    }

    /**
     * Example: `typeof Foo`.
     */
    export function TypeQueryToApiType(options: ApiItemOptions, type: ts.Type, typeNode: ts.TypeQueryNode): TypeQueryType {
        return {
            ...ReferenceBaseTypeToTypeDto(options, type, typeNode),
            ApiTypeKind: ApiTypeKind.TypeQuery,
            Keyword: TypeKeywords.Typeof
        };
    }

    export type HeritageKinds = ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword;

    export function GetHeritageList(
        heritageClauses: ts.NodeArray<ts.HeritageClause>,
        kind: HeritageKinds,
        options: ApiItemOptions
    ): ApiType[] {
        const typeChecker = options.Program.getTypeChecker();
        const list: ApiType[] = [];

        heritageClauses.forEach(heritage => {
            if (heritage.token !== kind) {
                return;
            }

            heritage.types.forEach(expressionType => {
                const type = typeChecker.getTypeFromTypeNode(expressionType);

                list.push(ResolveApiType(options, type, expressionType));
            });
        });

        return list;
    }
}
