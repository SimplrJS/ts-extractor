import * as ts from "typescript";
import { LogLevel } from "simplr-logger";

import { ApiItem } from "../abstractions/api-item";
import { ApiHelpers } from "../api-helpers";
import { ApiExportSpecifierDto, ApiExportSpecifierApiItems } from "../contracts/definitions/api-export-specifier-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiExportSpecifier extends ApiItem<ts.ExportSpecifier, ApiExportSpecifierDto> {
    private apiItems: ApiExportSpecifierApiItems;

    protected OnGatherData(): void {
        const targetSymbol = this.TypeChecker.getExportSpecifierLocalTargetSymbol(this.Declaration);
        const symbolReferences = ApiHelpers.GetItemIdsFromSymbol(targetSymbol, this.Options);

        if (symbolReferences != null) {
            this.apiItems = symbolReferences.Ids;
        } else {
            ApiHelpers.LogWithNodePosition(LogLevel.Warning, this.Declaration, "Exported item does not exist.");
        }
    }

    public OnExtract(): ApiExportSpecifierDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

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
