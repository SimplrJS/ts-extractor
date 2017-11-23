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
    private apiItems: ApiExportSpecifierApiItems;

    private getApiItems(targetSymbol: ts.Symbol | undefined): ApiExportSpecifierApiItems {
        const apiItems: ApiExportSpecifierApiItems = [];
        if (targetSymbol == null || targetSymbol.declarations == null) {
            return undefined;
        }

        targetSymbol.declarations.forEach(declaration => {
            const symbol = TSHelpers.GetSymbolFromDeclaration(declaration, this.TypeChecker);

            if (symbol != null) {
                const itemId = ApiHelpers.GetItemId(declaration, symbol, this.Options);

                if (itemId != null) {
                    apiItems.push(itemId);
                }
            }
        });

        return apiItems;
    }

    protected OnGatherData(): void {
        const targetSymbol = this.TypeChecker.getExportSpecifierLocalTargetSymbol(this.Declaration);

        this.apiItems = this.getApiItems(targetSymbol);
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
