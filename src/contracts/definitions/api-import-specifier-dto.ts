import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKind } from "../api-item-kind";

export type ApiImportSpecifierApiItems = string[] | undefined;

export interface ApiImportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.ImportSpecifier;
    ApiItems: ApiImportSpecifierApiItems;
}
