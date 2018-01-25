import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKind } from "../api-item-kind";

export type ApiExportSpecifierApiItems = string[] | undefined;

export interface ApiExportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.ExportSpecifier;
    ApiItems: ApiExportSpecifierApiItems;
}
