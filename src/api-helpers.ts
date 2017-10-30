import * as ts from "typescript";

import { ApiItem, ApiItemOptions } from "./abstractions/api-item";

import { ApiItemReferenceDict } from "./contracts/api-item-reference-dict";
import {
    TypeDto,
    TypeDefaultDto,
    TypeReferenceDto,
    TypeUnionOrIntersectionDto
} from "./contracts/type-dto";
import { ApiItemKinds } from "./contracts/api-item-kinds";
import { TypeKinds } from "./contracts/type-kinds";
import { AccessModifier } from "./contracts/access-modifier";
import { TSHelpers } from "./ts-helpers";
import { Logger, LogLevel } from "./utils/logger";

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
import { ApiType } from "./definitions/api-type";
import { ApiClass } from "./definitions/api-class";
import { ApiClassConstructor } from "./definitions/api-class-constructor";
import { ApiClassProperty } from "./definitions/api-class-property";
import { ApiClassMethod } from "./definitions/api-class-method";

export namespace ApiHelpers {
    // TODO: Add return dictionary of ApiItems.
    export function VisitApiItem(declaration: ts.Declaration, symbol: ts.Symbol, options: ApiItemOptions): ApiItem | undefined {
        let apiItem: ApiItem | undefined;
        if (ts.isSourceFile(declaration)) {
            apiItem = new ApiSourceFile(declaration, options);
        } else if (ts.isVariableDeclaration(declaration)) {
            apiItem = new ApiVariable(declaration, symbol, options);
        } else if (ts.isModuleDeclaration(declaration)) {
            apiItem = new ApiNamespace(declaration, symbol, options);
        } else if (ts.isFunctionDeclaration(declaration)) {
            apiItem = new ApiFunction(declaration, symbol, options);
        } else if (ts.isEnumDeclaration(declaration)) {
            apiItem = new ApiEnum(declaration, symbol, options);
        } else if (ts.isEnumMember(declaration)) {
            apiItem = new ApiEnumMember(declaration, symbol, options);
        } else if (ts.isInterfaceDeclaration(declaration)) {
            apiItem = new ApiInterface(declaration, symbol, options);
        } else if (ts.isPropertySignature(declaration)) {
            apiItem = new ApiProperty(declaration, symbol, options);
        } else if (ts.isMethodSignature(declaration)) {
            apiItem = new ApiMethod(declaration, symbol, options);
        } else if (ts.isParameter(declaration)) {
            apiItem = new ApiParameter(declaration, symbol, options);
        } else if (ts.isTypeAliasDeclaration(declaration)) {
            apiItem = new ApiType(declaration, symbol, options);
        } else if (ts.isClassDeclaration(declaration)) {
            apiItem = new ApiClass(declaration, symbol, options);
        } else if (ts.isConstructorDeclaration(declaration)) {
            apiItem = new ApiClassConstructor(declaration, symbol, options);
        } else if (ts.isPropertyDeclaration(declaration)) {
            apiItem = new ApiClassProperty(declaration, symbol, options);
        } else if (ts.isMethodDeclaration(declaration)) {
            apiItem = new ApiClassMethod(declaration, symbol, options);
        }

        if (apiItem != null && apiItem.IsPrivate()) {
            return;
        }

        if (apiItem == null) {
            // This declaration is not supported, show a Warning message.
            const sourceFile = declaration.getSourceFile();
            const position = sourceFile.getLineAndCharacterOfPosition(declaration.getStart());
            const linePrefix = `${sourceFile.fileName}[${position.line + 1}:${position.character + 1}]`;
            Logger.Log(LogLevel.Warning, `${linePrefix}: Declaration "${ts.SyntaxKind[declaration.kind]}" is not supported yet.`);
        }

        return apiItem;
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
            const name = symbol.name;

            let declarationId = options.ItemsRegistry.Find(declarationItem);
            if (declarationId == null) {
                const visitedItem = VisitApiItem(declarationItem, symbol, options);
                if (visitedItem == null) {
                    return;
                }

                declarationId = options.ItemsRegistry.Add(visitedItem);
            }

            if (items[name] == null) {
                items[name] = declarationId;
            } else {
                const refs = items[name];
                if (Array.isArray(refs)) {
                    refs.push(declarationId);
                } else {
                    items[name] = [refs, declarationId];
                }
            }
        });

        return items;
    }

    export type HeritageKinds = ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword;

    export function GetHeritageList(
        heritageClauses: ts.NodeArray<ts.HeritageClause>,
        kind: HeritageKinds,
        options: ApiItemOptions
    ): TypeDto[] {
        const typeChecker = options.Program.getTypeChecker();
        const list: TypeDto[] = [];

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

    export function TypeToApiTypeDto(type: ts.Type, options: ApiItemOptions): TypeDto {
        const typeChecker = options.Program.getTypeChecker();
        const text = typeChecker.typeToString(type);

        const symbol = type.getSymbol() || type.aliasSymbol;
        let generics: TypeDto[] | undefined;
        let kind = TypeKinds.Default;
        let types: TypeDto[] | undefined;
        let name: string | undefined;

        // Generics
        if (TSHelpers.IsTypeWithTypeArguments(type)) {
            generics = type.typeArguments.map<TypeDto>(x => TypeToApiTypeDto(x, options));
        } else if (type.aliasTypeArguments != null) {
            generics = type.aliasTypeArguments.map<TypeDto>(x => TypeToApiTypeDto(x, options));
        }

        // Find declaration reference.
        if (symbol != null) {
            name = symbol.getName();

            if (symbol.declarations != null && symbol.declarations.length > 0) {
                const declarationId = options.ItemsRegistry.Find(symbol.declarations[0]);

                if (declarationId != null) {
                    return {
                        ApiTypeKind: TypeKinds.Reference,
                        ReferenceId: declarationId,
                        Name: name,
                        Text: text,
                        Generics: generics
                    } as TypeReferenceDto;
                }
            }
        }

        // Union or Intersection
        if (TSHelpers.IsTypeUnionOrIntersectionType(type)) {
            if (TSHelpers.IsTypeUnionType(type)) {
                kind = TypeKinds.Union;
            } else {
                kind = TypeKinds.Intersection;
            }

            types = type.types.map(x => TypeToApiTypeDto(x, options));

            return {
                ApiTypeKind: kind,
                Flags: type.flags,
                FlagsString: ts.TypeFlags[type.flags],
                Name: name,
                Text: text,
                Types: types
            } as TypeUnionOrIntersectionDto;
        }

        // Default
        return {
            ApiTypeKind: kind,
            Flags: type.flags,
            FlagsString: ts.TypeFlags[type.flags],
            Name: name,
            Text: text,
            Generics: generics
        } as TypeDefaultDto;
    }

    export function ResolveAccessModifierFromModifiers(modifiers?: ts.NodeArray<ts.Modifier>): AccessModifier {
        let accessModifier = AccessModifier.Public;

        if (modifiers != null) {
            modifiers.forEach(modifier => {
                switch (modifier.kind) {
                    case ts.SyntaxKind.PublicKeyword: {
                        accessModifier = AccessModifier.Public;
                        return;
                    }
                    case ts.SyntaxKind.PrivateKeyword: {
                        accessModifier = AccessModifier.Private;
                        return;
                    }
                    case ts.SyntaxKind.ProtectedKeyword: {
                        accessModifier = AccessModifier.Protected;
                        return;
                    }
                }
            });
        }

        return accessModifier;
    }

    export function ModifierKindExistsInModifiers(modifiers: ts.NodeArray<ts.Modifier> | undefined, kind: ts.SyntaxKind): boolean {
        if (modifiers != null) {
            return modifiers.some(x => x.kind === kind);
        }

        return false;
    }
}
