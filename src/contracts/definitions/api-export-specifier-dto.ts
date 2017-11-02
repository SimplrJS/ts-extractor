import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { TypeDto } from "../type-dto";

export type ApiExportSpecifierApiItems = string[] | undefined;

export interface ApiExportSpecifierDto extends ApiBaseItemDto {
    ApiItems: ApiExportSpecifierApiItems;
}
