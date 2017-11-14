import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";

export type ApiExportSpecifierApiItems = string[] | undefined;

export interface ApiExportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.ExportSpecifier;
    ApiItems: ApiExportSpecifierApiItems;
}
