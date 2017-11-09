import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";

export interface ApiEnumDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDictionary;
}
