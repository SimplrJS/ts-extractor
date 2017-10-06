import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "./abstractions/api-item";

import { ApiItemReferenceDict } from "./contracts/api-items/api-item-reference-dict";
import { ApiTypeDto } from "./contracts/api-items/api-type-dto";
import { ApiItemType } from "./contracts/api-items/api-item-type";
import { TSHelpers } from "./ts-helpers";

import { ApiSourceFile } from "./definitions/api-source-file";
import { ApiVariable } from "./definitions/api-variable";
import { ApiNamespace } from "./definitions/api-namespace";
import { ApiFunction } from "./definitions/api-function";
import { ApiEnum } from "./definitions/api-enum";
import { ApiEnumMember } from "./definitions/api-enum-member";
import { ApiInterface } from "./definitions/api-interface";
import { ApiProperty } from "./definitions/api-property";
import { ApiMethod } from "./definitions/api-method";
import { ApiParameter } from "./definitions/api-parameter";

export namespace ApiHelpers {
    // TODO: Add return dictionary of ApiItems.
    export function VisitApiItem(declaration: ts.Declaration, symbol: ts.Symbol, options: ApiItemOptions): ApiItem | undefined {
        if (ts.isSourceFile(declaration)) {
            return new ApiSourceFile(declaration, options);
        } else if (ts.isVariableDeclaration(declaration)) {
            return new ApiVariable(declaration, symbol, options);
        } else if (ts.isModuleDeclaration(declaration)) {
            return new ApiNamespace(declaration, symbol, options);
        } else if (ts.isFunctionDeclaration(declaration)) {
            return new ApiFunction(declaration, symbol, options);
        } else if (ts.isEnumDeclaration(declaration)) {
            return new ApiEnum(declaration, symbol, options);
        } else if (ts.isEnumMember(declaration)) {
            return new ApiEnumMember(declaration, symbol, options);
        } else if (ts.isInterfaceDeclaration(declaration)) {
            return new ApiInterface(declaration, symbol, options);
        } else if (ts.isPropertySignature(declaration)) {
            return new ApiProperty(declaration, symbol, options);
        } else if (ts.isMethodSignature(declaration)) {
            return new ApiMethod(declaration, symbol, options);
        } else if (ts.isParameter(declaration)) {
            return new ApiParameter(declaration, symbol, options);
        }

        console.log(`Declaration: ${ts.SyntaxKind[declaration.kind]} is not supported.`);
    }

    export function GetItemsFromSymbolsIds(
        symbols: ts.UnderscoreEscapedMap<ts.Symbol> | undefined,
        options: ApiItemOptions
    ): ApiItemReferenceDict {
        const items: ApiItemReferenceDict = {};
        if (symbols == null) {
            return items;
        }

        symbols.forEach(symbolItem => {
            if (symbolItem.declarations == null) {
                return;
            }
            const symbolItems: string[] = [];

            symbolItem.declarations.forEach(declarationItem => {
                // Check if declaration already exists in the registry.
                const declarationId = options.ItemsRegistry.Find(declarationItem);
                if (declarationId != null) {
                    symbolItems.push(declarationId);
                    return;
                }

                const visitedItem = VisitApiItem(declarationItem, symbolItem, options);
                if (visitedItem == null) {
                    return;
                }

                symbolItems.push(options.ItemsRegistry.Add(visitedItem));
            });

            items[symbolItem.name] = symbolItems.length === 1 ? symbolItems.toString() : symbolItems;
        });

        return items;
    }

    export function GetItemsFromDeclarationsIds(declarations: ts.NodeArray<ts.Declaration>, options: ApiItemOptions): ApiItemReferenceDict {
        const items: ApiItemReferenceDict = {};
        const typeChecker = options.Program.getTypeChecker();

        declarations.forEach(declarationItem => {
            const symbol = TSHelpers.GetSymbolFromDeclaration(declarationItem, typeChecker);
            if (symbol == null) {
                return;
            }

            const declarationId = options.ItemsRegistry.Find(declarationItem);
            if (declarationId != null) {
                items[symbol.name] = declarationId;
                return;
            }

            const visitedItem = VisitApiItem(declarationItem, symbol, options);
            if (visitedItem == null) {
                return;
            }

            items[symbol.name] = options.ItemsRegistry.Add(visitedItem);
        });

        return items;
    }

    export type HeritageKinds = ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword;

    export function GetHeritageList(
        heritageClauses: ts.NodeArray<ts.HeritageClause>,
        kind: HeritageKinds,
        options: ApiItemOptions
    ): ApiTypeDto[] {
        const typeChecker = options.Program.getTypeChecker();
        const list: ApiTypeDto[] = [];

        heritageClauses.forEach(heritage => {
            if (heritage.token !== kind) {
                return;
            }

            heritage.types.forEach(expressionType => {
                const type = typeChecker.getTypeFromTypeNode(expressionType);

                list.push(TypeToApiTypeDto(type, options));
            });
        });

        return list;
    }

    export function TypeToApiTypeDto(type: ts.Type, options: ApiItemOptions): ApiTypeDto {
        const typeChecker = options.Program.getTypeChecker();

        const symbol = type.getSymbol();
        let generics: ApiTypeDto[] = [];
        let declarationId: string | undefined;
        let text: string;

        if (symbol != null) {
            text = symbol.getName();
            if (symbol.declarations != null && symbol.declarations.length > 0) {
                declarationId = options.ItemsRegistry.Find(symbol.declarations[0]);
            }
        } else {
            text = typeChecker.typeToString(type);
        }

        if (TSHelpers.IsTypeWithTypeArguments(type)) {
            generics = type.typeArguments.map<ApiTypeDto>(x => TypeToApiTypeDto(x, options));
        }

        return {
            ApiType: ApiItemType.Type,
            Reference: declarationId,
            Generics: (generics.length > 0 ? generics : undefined),
            Text: text
        };
    }
}
