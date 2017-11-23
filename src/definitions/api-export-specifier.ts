import * as ts from "typescript";
import * as path from "path";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFile } from "./api-source-file";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiExportSpecifierDto, ApiExportSpecifierApiItems } from "../contracts/definitions/api-export-specifier-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiExportSpecifier extends ApiItem<ts.ExportSpecifier, ApiExportSpecifierDto> {
    private targetSymbol: ts.Symbol | undefined;
    private apiItems: ApiExportSpecifierApiItems;

    private getApiItems(): ApiExportSpecifierApiItems {
        const apiItems: ApiExportSpecifierApiItems = [];
        if (this.targetSymbol == null || this.targetSymbol.declarations == null) {
            return;
        }

        this.targetSymbol.declarations.forEach(declaration => {
            const symbol = TSHelpers.GetSymbolFromDeclaration(declaration, this.TypeChecker);
            if (symbol == null) {
                return;
            }

            const itemId = ApiHelpers.GetItemId(declaration, symbol, this.Options);
            if (itemId == null) {
                return;
            }

            apiItems.push(itemId);
        });

        return apiItems;
    }

    protected OnGatherData(): void {
        this.targetSymbol = this.TypeChecker.getExportSpecifierLocalTargetSymbol(this.Declaration);

        this.apiItems = this.getApiItems();
    }

    public OnExtract(): ApiExportSpecifierDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.ExportSpecifier,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            ApiItems: this.apiItems
        };
    }
}
