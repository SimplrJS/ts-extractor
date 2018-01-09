import * as ts from "typescript";
import * as path from "path";
import { LogLevel } from "simplr-logger";

import { ApiItem, ApiItemOptions } from "./abstractions/api-item";

import { ApiItemReference } from "./contracts/api-item-reference";
import {
    TypeDto,
    TypeBasicDto,
    TypeUnionOrIntersectionDto
} from "./contracts/type-dto";
import { TypeKinds } from "./contracts/type-kinds";
import { AccessModifier } from "./contracts/access-modifier";
import { TSHelpers } from "./ts-helpers";
import { Logger } from "./utils/logger";
import { ApiItemLocationDto } from "./contracts/api-item-location-dto";

import { ApiSourceFile } from "./definitions/api-source-file";
import { ApiExport } from "./definitions/api-export";
import { ApiExportSpecifier } from "./definitions/api-export-specifier";
import { ApiImportSpecifier } from "./definitions/api-import-specifier";
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
import { ApiGetAccessor } from "./definitions/api-get-accessor";
import { ApiSetAccessor } from "./definitions/api-set-accessor";
import { ApiIndex } from "./definitions/api-index";
import { ApiCall } from "./definitions/api-call";
import { ApiConstruct } from "./definitions/api-construct";
import { ApiTypeParameter } from "./definitions/api-type-parameter";
import { ApiTypeLiteral } from "./definitions/api-type-literal";
import { ApiFunctionType } from "./definitions/api-function-type";
import { PathIsInside } from "./utils/path-is-inside";

export namespace ApiHelpers {
    export function VisitApiItem(
        declaration: ts.Declaration,
        symbol: ts.Symbol,
        options: ApiItemOptions
    ): ApiItem | undefined {
        let apiItem: ApiItem | undefined;
        if (ts.isSourceFile(declaration)) {
            apiItem = new ApiSourceFile(declaration, symbol, options);
        } else if (ts.isExportDeclaration(declaration)) {
            apiItem = new ApiExport(declaration, symbol, options);
        } else if (ts.isExportSpecifier(declaration)) {
            apiItem = new ApiExportSpecifier(declaration, symbol, options);
        } else if (ts.isImportSpecifier(declaration)) {
            apiItem = new ApiImportSpecifier(declaration, symbol, options);
        } else if (ts.isVariableDeclaration(declaration)) {
            apiItem = new ApiVariable(declaration, symbol, options);
        } else if (ts.isModuleDeclaration(declaration) || ts.isNamespaceImport(declaration)) {
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
        } else if (ts.isGetAccessorDeclaration(declaration)) {
            apiItem = new ApiGetAccessor(declaration, symbol, options);
        } else if (ts.isSetAccessorDeclaration(declaration)) {
            apiItem = new ApiSetAccessor(declaration, symbol, options);
        } else if (ts.isIndexSignatureDeclaration(declaration)) {
            apiItem = new ApiIndex(declaration, symbol, options);
        } else if (ts.isCallSignatureDeclaration(declaration)) {
            apiItem = new ApiCall(declaration, symbol, options);
        } else if (ts.isConstructSignatureDeclaration(declaration)) {
            apiItem = new ApiConstruct(declaration, symbol, options);
        } else if (ts.isTypeParameterDeclaration(declaration)) {
            apiItem = new ApiTypeParameter(declaration, symbol, options);
        } else if (ts.isTypeLiteralNode(declaration)) {
            apiItem = new ApiTypeLiteral(declaration, symbol, options);
        } else if (ts.isFunctionTypeNode(declaration)) {
            apiItem = new ApiFunctionType(declaration, symbol, options);
        }

        if (apiItem == null) {
            // This declaration is not supported, show a Warning message.
            LogWithNodePosition(
                LogLevel.Warning,
                declaration,
                `Declaration "${ts.SyntaxKind[declaration.kind]}" is not supported yet.`
            );
        }

        return apiItem;
    }

    export const NODE_MODULES_PACKAGE_REGEX = /\/node_modules\/(.+?)\//;

    export function ShouldVisit(declaration: ts.Declaration, options: ApiItemOptions): boolean {
        const declarationSourceFile = declaration.getSourceFile();
        const declarationFileName = declarationSourceFile.fileName;

        if (options.Program.isSourceFileFromExternalLibrary(declarationSourceFile)) {
            const match = declarationSourceFile.fileName.match(NODE_MODULES_PACKAGE_REGEX);
            const packageName = match != null ? match[1] : undefined;

            if (packageName != null) {
                return options.ExternalPackages.
                    findIndex(x => x.toLowerCase() === packageName.toLowerCase()) !== -1;
            } else {
                return false;
            }
        } else if (!PathIsInside(declarationFileName, options.ExtractorOptions.ProjectDirectory)) {
            // If it's not external package, it should be in project directory.
            return false;
        }

        return true;
    }

    export function GetItemId(declaration: ts.Declaration, symbol: ts.Symbol, options: ApiItemOptions): string | undefined {
        if (!ShouldVisit(declaration, options)) {
            return undefined;
        }

        if (options.Registry.HasDeclaration(declaration)) {
            return options.Registry.GetDeclarationId(declaration);
        }

        const resolveRealSymbol = TSHelpers.FollowSymbolAliases(symbol, options.Program.getTypeChecker());
        const apiItem = VisitApiItem(declaration, resolveRealSymbol, options);
        if (apiItem == null) {
            return undefined;
        }

        return options.AddItemToRegistry(apiItem);
    }

    export function GetItemsIdsFromSymbolsMap(
        symbols: ts.UnderscoreEscapedMap<ts.Symbol> | undefined,
        options: ApiItemOptions
    ): ApiItemReference[] {
        const items: ApiItemReference[] = [];
        if (symbols == null) {
            return items;
        }

        symbols.forEach(symbol => {
            const referenceTuple = GetItemIdsFromSymbol(symbol, options);
            if (referenceTuple != null) {
                items.push(referenceTuple);
            }
        });

        return items;
    }

    export function GetItemIdsFromSymbol(symbol: ts.Symbol | undefined, options: ApiItemOptions): ApiItemReference | undefined {
        if (symbol == null || symbol.declarations == null) {
            return undefined;
        }
        const symbolItems: string[] = [];

        symbol.declarations.forEach(declaration => {
            const itemId = GetItemId(declaration, symbol, options);
            if (itemId != null) {
                symbolItems.push(itemId);
            }
        });

        return {
            Alias: symbol.name,
            Ids: symbolItems
        };
    }

    export function GetItemsIdsFromDeclarations(
        declarations: ts.NodeArray<ts.Declaration>,
        options: ApiItemOptions
    ): ApiItemReference[] {
        const items: ApiItemReference[] = [];
        const typeChecker = options.Program.getTypeChecker();

        declarations.forEach(declaration => {
            const symbol = TSHelpers.GetSymbolFromDeclaration(declaration, typeChecker);
            if (symbol == null) {
                return;
            }

            const itemId = GetItemId(declaration, symbol, options);
            if (itemId == null) {
                return;
            }

            const index = items.findIndex(x => x != null && x.Alias === symbol.name);

            if (index === -1) {
                items.push({
                    Alias: symbol.name,
                    Ids: [itemId]
                });
            } else {
                items[index].Ids.push(itemId);
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

    /**
     * Converts from TypeScript type AST to TypeDto.
     * @param type TypeScript type
     * @param options ApiItem options
     * @param self This is only for `TypeAliasDeclaration`
     */
    export function TypeToApiTypeDto(type: ts.Type, options: ApiItemOptions, self?: boolean): TypeDto {
        const typeChecker = options.Program.getTypeChecker();
        const text = typeChecker.typeToString(type);

        let generics: TypeDto[] | undefined;
        let kind = TypeKinds.Basic;
        let types: TypeDto[] | undefined;
        let name: string | undefined;
        let referenceId: string | undefined;

        // Find declaration reference.
        const symbol = self ? type.getSymbol() : type.aliasSymbol || type.getSymbol();
        if (symbol != null) {
            name = symbol.getName();

            if (symbol.declarations != null && symbol.declarations.length > 0) {
                const declaration: ts.Declaration = symbol.declarations[0];

                referenceId = GetItemId(declaration, symbol, options);
            }
        }

        // Generics
        if (TSHelpers.IsTypeWithTypeArguments(type)) {
            generics = type.typeArguments.map<TypeDto>(x => TypeToApiTypeDto(x, options));
        } else if (type.aliasTypeArguments != null) {
            generics = type.aliasTypeArguments.map<TypeDto>(x => TypeToApiTypeDto(x, options));
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
                Types: types,
                ReferenceId: referenceId
            } as TypeUnionOrIntersectionDto;
        }

        // Resolve other type kinds
        if (TSHelpers.IsTypeTypeParameter(type)) {
            kind = TypeKinds.TypeParameter;
        }

        // Basic
        return {
            ApiTypeKind: kind,
            Flags: type.flags,
            FlagsString: ts.TypeFlags[type.flags],
            Name: name,
            Text: text,
            Generics: generics,
            ReferenceId: referenceId
        } as TypeBasicDto;
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

    export function LogWithNodePosition(logLevel: LogLevel, declaration: ts.Node, message: string): void {
        const sourceFile = declaration.getSourceFile();
        const position = sourceFile.getLineAndCharacterOfPosition(declaration.getStart());
        const linePrefix = `${sourceFile.fileName}[${position.line + 1}:${position.character + 1}]`;
        Logger.Log(logLevel, `${linePrefix}: ${message}`);
    }

    export function StandardizeRelativePath(location: string, options: ApiItemOptions): string {
        const workingSep = options.ExtractorOptions.OutputPathSeparator;
        const fixedLocation = location.split(path.sep).join(workingSep);

        if ((path.isAbsolute(fixedLocation) && fixedLocation[0] !== workingSep) || fixedLocation[0] === ".") {
            return fixedLocation;
        }

        if (fixedLocation[0] === workingSep) {
            return `.${fixedLocation}`;
        }

        return `.${workingSep}${fixedLocation}`;
    }

    export function GetApiItemLocationDtoFromNode(node: ts.Node, options: ApiItemOptions): ApiItemLocationDto {
        const sourceFile = node.getSourceFile();

        const isExternalPackage = options.Program.isSourceFileFromExternalLibrary(sourceFile);
        const position = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const fileNamePath = path.relative(options.ExtractorOptions.ProjectDirectory, sourceFile.fileName);
        let fileName = StandardizeRelativePath(fileNamePath, options);

        if (isExternalPackage) {
            const packageFullPath = fileName.match(/\/node_modules\/(.+?)$/);

            if (packageFullPath != null) {
                const [, packagePath] = packageFullPath;
                fileName = packagePath;
            }
        }

        return {
            FileName: fileName,
            Line: position.line,
            Character: position.character,
            IsExternalPackage: isExternalPackage
        };
    }
}
