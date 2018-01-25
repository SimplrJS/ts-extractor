import * as ts from "typescript";
import { LogLevel } from "simplr-logger";

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
import { ApiItemLocationDto } from "./contracts/api-item-location-dto";

export namespace ApiTypeHelpers {
    /**
     * Resolves ApiType from TypeScript type system.
     * @param options ApiItem otpions
     * @param location ApiItem location for fallback if typeNode is synthesized.
     * @param type Type from TypeScript type system.
     * @param typeNode Type node.
     * @param self For ApiTypeAlias only. Not to have reference to itself.
     */
    export function ResolveApiType(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode?: ts.TypeNode,
        self?: boolean
    ): ApiType {
        const typeChecker = options.Program.getTypeChecker();

        if (typeNode == null) {
            typeNode = typeChecker.typeToTypeNode(type);
        }

        if (ts.isTypeReferenceNode(typeNode) || ts.isExpressionWithTypeArguments(typeNode)) {
            return TypeReferenceNodeToApiType(options, location, type, typeNode, self);
        } else if (ts.isUnionTypeNode(typeNode) || ts.isIntersectionTypeNode(typeNode)) {
            return TypeNodeUnionOrIntersectionToApiType(options, location, type as ts.UnionOrIntersectionType, typeNode);
        } else if (ts.isArrayTypeNode(typeNode)) {
            return ArrayTypeNodeToApiType(options, location, type, typeNode);
        } else if (ts.isTupleTypeNode(typeNode)) {
            return TupleTypeNodeToApiType(options, location, type, typeNode);
        } else if (ts.isTypeLiteralNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, location, type, typeNode, ApiTypeKind.TypeLiteral) as TypeLiteralType;
        } else if (ts.isMappedTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, location, type, typeNode, ApiTypeKind.Mapped) as MappedType;
        } else if (ts.isFunctionTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, location, type, typeNode, ApiTypeKind.FunctionType) as FunctionTypeType;
        } else if (ts.isThisTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, location, type, typeNode, ApiTypeKind.This) as ThisType;
        } else if (ts.isConstructorTypeNode(typeNode)) {
            return ReferenceBaseTypeToTypeDto(options, location, type, typeNode, ApiTypeKind.Constructor) as ConstructorType;
        } else if (ts.isTypePredicateNode(typeNode)) {
            return TypePredicateNodeToApiType(options, location, type, typeNode);
        } else if (ts.isTypeOperatorNode(typeNode)) {
            return TypeOperatorNodeToApiType(options, location, type, typeNode);
        } else if (ts.isIndexedAccessTypeNode(typeNode)) {
            return IndexedAccessTypeNodeToApiType(options, location, type, typeNode);
        } else if (ts.isParenthesizedTypeNode(typeNode)) {
            return ParenthesizedTypeNodeToApiType(options, location, type, typeNode);
        } else if (ts.isTypeQueryNode(typeNode)) {
            return TypeQueryToApiType(options, location, type, typeNode);
        }

        return ResolveApiBasicType(options, location, type, typeNode);
    }

    /**
     * @internal
     */
    export function typeNodeToBaseType(
        options: ApiItemOptions,
        apiItemlocation: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.TypeNode
    ): ApiBaseType {
        const typeChecker = options.Program.getTypeChecker();
        const text = typeChecker.typeToString(type);

        let location: ApiItemLocationDto;
        if (TSHelpers.IsNodeSynthesized(typeNode)) {
            location = apiItemlocation;
        } else {
            location = ApiHelpers.GetApiItemLocationDtoFromNode(typeNode, options);
        }

        const result: ApiBaseType = {
            ApiTypeKind: ApiTypeKind.Basic,
            Location: location,
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

    export function ResolveApiBasicType(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.TypeNode
    ): ApiBasicType {
        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
            ApiTypeKind: ApiTypeKind.Basic
        };
    }

    /**
     * Resolving `Definition` reference.
     * @param kind `ApiReferenceBaseType` ApiTypeKind value
     */
    export function ReferenceBaseTypeToTypeDto(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
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
            ...typeNodeToBaseType(options, location, type, typeNode),
            ApiTypeKind: kind || ApiTypeKind.Basic,
            ReferenceId: referenceId
        };
    }

    /**
     * Example `Foo`.
     */
    export function TypeReferenceNodeToApiType(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
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
                .map(x => ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(x), x));
        } else if (TSHelpers.IsTypeWithTypeArguments(type)) {
            typeParameters = type.typeArguments
                .map(x => ResolveApiType(options, location, x, typeChecker.typeToTypeNode(x)));
        }

        const symbol = self ? type.getSymbol() : type.aliasSymbol || type.getSymbol();
        if (symbol != null) {
            const { name, referenceId } = resolveTypeItemReference(symbol, options);
            refenceId = referenceId;
            symbolName = name;
        }

        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
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
        location: ApiItemLocationDto,
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
                .map(x => ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(x), x));
        } else {
            members = type.types
                .map(x => ResolveApiType(options, location, x, typeChecker.typeToTypeNode(x)));
        }

        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
            ApiTypeKind: apiTypeKind,
            Members: members
        };
    }

    /**
     * Example `string[]`.
     */
    export function ArrayTypeNodeToApiType(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.ArrayTypeNode
    ): ArrayType {
        const typeChecker = options.Program.getTypeChecker();

        let apiType: ApiType;
        if (!TSHelpers.IsNodeSynthesized(typeNode)) {
            apiType = ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(typeNode.elementType), typeNode.elementType);
        } else if (TSHelpers.IsTypeWithTypeArguments(type)) {
            const arrayType = type.typeArguments[0];
            apiType = ResolveApiType(options, location, arrayType, typeChecker.typeToTypeNode(arrayType));
        } else {
            ApiHelpers.LogWithLocation(LogLevel.Error, location, "Couldn't resolve ArrayTypeNode element type.");
            apiType = ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(typeNode.elementType), typeNode.elementType);
        }

        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
            ApiTypeKind: ApiTypeKind.Array,
            Type: apiType
        };
    }

    /**
     * Example `[string, number]`.
     */
    export function TupleTypeNodeToApiType(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.TupleTypeNode
    ): TupleType {
        const typeChecker = options.Program.getTypeChecker();

        let members: ApiType[];
        if (!TSHelpers.IsNodeSynthesized(typeNode)) {
            members = typeNode.elementTypes
                .map(x => ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(x), x));
        } else if (TSHelpers.IsTypeWithTypeArguments(type)) {
            members = type.typeArguments.map(x => ResolveApiType(options, location, x, typeChecker.typeToTypeNode(x)));
        } else {
            ApiHelpers.LogWithLocation(LogLevel.Error, location, "Couldn't resolve TupleType members.");
            members = [];
        }

        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
            ApiTypeKind: ApiTypeKind.Tuple,
            Members: members
        };
    }

    /**
     * Example `arg is string`.
     */
    export function TypePredicateNodeToApiType(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.TypePredicateNode
    ): TypePredicateType {
        const typeChecker = options.Program.getTypeChecker();
        const parameterName: string = typeNode.parameterName.getText();
        const apiType = ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(typeNode.type), typeNode.type);

        // Otherwise text will be "boolean".
        const text = `${parameterName} is ${apiType.Text}`;

        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
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
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.TypeOperatorNode
    ): TypeOperatorType {
        const typeChecker = options.Program.getTypeChecker();
        const apiType = ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(typeNode.type), typeNode.type);
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
            ...typeNodeToBaseType(options, location, type, typeNode),
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
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.IndexedAccessTypeNode
    ): IndexedAccessType {
        const typeChecker = options.Program.getTypeChecker();
        const objectApiType = ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(typeNode.objectType), typeNode.objectType);
        const indexApiType = ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(typeNode.indexType), typeNode.indexType);

        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
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
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.ParenthesizedTypeNode
    ): ParenthesizedType {
        const typeChecker = options.Program.getTypeChecker();
        const apiType = ResolveApiType(options, location, typeChecker.getTypeFromTypeNode(typeNode.type), typeNode.type);

        return {
            ...typeNodeToBaseType(options, location, type, typeNode),
            ApiTypeKind: ApiTypeKind.Parenthesized,
            Type: apiType
        };
    }

    /**
     * Example: `typeof Foo`.
     */
    export function TypeQueryToApiType(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
        type: ts.Type,
        typeNode: ts.TypeQueryNode
    ): TypeQueryType {
        return {
            ...ReferenceBaseTypeToTypeDto(options, location, type, typeNode),
            ApiTypeKind: ApiTypeKind.TypeQuery,
            Keyword: TypeKeywords.Typeof
        };
    }

    export type HeritageKinds = ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword;

    /**
     * Gets heritage list by kind.
     * @param options Api item options.
     * @param location ApiItem location.
     * @param heritageClauses Array of heritage clauses.
     * @param kind Implements or Extends keyword.
     */
    export function GetHeritageList(
        options: ApiItemOptions,
        location: ApiItemLocationDto,
        heritageClauses: ts.NodeArray<ts.HeritageClause>,
        kind: HeritageKinds
    ): ApiType[] {
        const typeChecker = options.Program.getTypeChecker();
        const list: ApiType[] = [];

        heritageClauses.forEach(heritage => {
            if (heritage.token !== kind) {
                return;
            }

            heritage.types.forEach(expressionType => {
                const type = typeChecker.getTypeFromTypeNode(expressionType);

                list.push(ResolveApiType(options, location, type, expressionType));
            });
        });

        return list;
    }
}
