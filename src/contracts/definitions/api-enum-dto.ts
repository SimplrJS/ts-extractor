import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";

export interface ApiEnumDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDict;
}
