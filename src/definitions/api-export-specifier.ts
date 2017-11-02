import * as ts from "typescript";
import * as path from "path";

import { Logger, LogLevel } from "../utils/logger";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFile } from "./api-source-file";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiExportSpecifierDto, ApiExportSpecifierApiItems } from "../contracts/definitions/api-export-specifier-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

export class ApiExportSpecifier extends ApiItem<ts.ExportSpecifier, ApiExportSpecifierDto> {
    constructor(declaration: ts.ExportSpecifier, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        this.targetSymbol = this.TypeChecker.getExportSpecifierLocalTargetSymbol(declaration);

        this.apiItems = this.getApiItems();
    }

    private targetSymbol: ts.Symbol | undefined;
    private apiItems: ApiExportSpecifierApiItems;

    private getApiItems(): ApiExportSpecifierApiItems {
        const apiItems: ApiExportSpecifierApiItems = [];
        if (this.targetSymbol == null || this.targetSymbol.declarations == null) {
            return;
        }

        this.targetSymbol.declarations.forEach(declarationItem => {
            const declarationId = this.Options.ItemsRegistry.Find(declarationItem);
            if (declarationId != null) {
                apiItems.push(declarationId);
                return;
            }

            const visitedItem = ApiHelpers.VisitApiItem(declarationItem, this.Symbol, this.Options);
            if (visitedItem == null) {
                return;
            }

            apiItems.push(this.Options.ItemsRegistry.Add(visitedItem));
        });

        return apiItems;
    }

    public Extract(): ApiExportSpecifierDto {
        return {
            ApiKind: ApiItemKinds.ExportSpecifier,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Meta: this.GetItemMeta(),
            ApiItems: this.apiItems
        };
    }
}
