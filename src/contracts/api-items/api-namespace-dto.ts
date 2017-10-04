import { ApiItemDto } from "./api-item-dto";
import { ApiItemReferenceDict } from "./api-item-reference-dict";

export interface ApiNamespaceDto extends ApiItemDto {
    Members: ApiItemReferenceDict;
}
