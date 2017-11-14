import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Export;
    Members: ApiItemReferenceDictionary;
    ExportPath: string;
}
