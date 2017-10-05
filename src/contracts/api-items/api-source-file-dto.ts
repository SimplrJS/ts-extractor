import { ApiItemDto } from "./api-item-dto";
import { ApiItemReferenceDict } from "./api-item-reference-dict";

export interface ApiSourceFileDto extends ApiItemDto {
    FileName: string;
    Members: ApiItemReferenceDict;
}
