import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { TypeDto } from "../type-dto";

export interface ApiExportDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDict;
    ExportPath: string;
}
