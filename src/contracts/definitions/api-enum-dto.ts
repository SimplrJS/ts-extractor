import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dict";

export interface ApiEnumDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDictionary;
}
