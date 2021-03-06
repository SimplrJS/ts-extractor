import * as ts from "typescript";
import { LogLevel } from "simplr-logger";

import { ApiHelpers } from "../api-helpers";
import { TsHelpers } from "../ts-helpers";
import { ApiItem } from "../abstractions/api-item";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiDefinitionKind, ApiImportSpecifierDto, ApiImportSpecifierApiItems } from "../contracts/api-definitions";

export class ApiImportSpecifier extends ApiItem<ts.ImportSpecifier, ApiImportSpecifierDto> {
    private location: ApiItemLocationDto;
    private apiItems: ApiImportSpecifierApiItems;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        const targetSymbol = TsHelpers.GetImportSpecifierLocalTargetSymbol(this.Declaration, this.Options.Program);
        const symbolReferences = ApiHelpers.GetItemIdsFromSymbol(targetSymbol, this.Options);

        if (symbolReferences != null) {
            this.apiItems = symbolReferences.Ids;
        } else {
            ApiHelpers.LogWithNodePosition(LogLevel.Warning, this.Declaration, "Imported item does not exist.");
        }
    }

    public OnExtract(): ApiImportSpecifierDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiDefinitionKind.ImportSpecifier,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            ApiItems: this.apiItems,
            _ts: this.GetTsDebugInfo()
        };
    }
}
