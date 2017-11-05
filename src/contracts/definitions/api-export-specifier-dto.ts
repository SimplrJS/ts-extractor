import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { TypeDto } from "../type-dto";

export type ApiExportSpecifierApiItems = string[] | undefined;

export interface ApiExportSpecifierDto extends ApiBaseItemDto {
    ApiItems: ApiExportSpecifierApiItems;
}
