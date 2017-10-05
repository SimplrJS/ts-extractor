import { ApiItemDto } from "./api-item-dto";
import { ApiItemReferenceDict } from "./api-item-reference-dict";

export interface ApiInterfaceDto extends ApiItemDto {
    Members: ApiItemReferenceDict;
    Extends: string[];
}
