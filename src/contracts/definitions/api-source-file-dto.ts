import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";

export interface ApiSourceFileDto extends ApiBaseItemDto {
    Path: string;
    Members: ApiItemReferenceDict;
}
