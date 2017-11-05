import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";

export interface ApiNamespaceDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDictionary;
}
