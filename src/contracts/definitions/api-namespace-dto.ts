import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";

export interface ApiNamespaceDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDict;
}
