import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dict";

export interface ApiNamespaceDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDictionary;
}
