import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";

export type ApiImportSpecifierApiItems = string[] | undefined;

export interface ApiImportSpecifierDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.ImportSpecifier;
    ApiItems: ApiImportSpecifierApiItems;
}
