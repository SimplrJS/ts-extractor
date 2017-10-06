import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { ApiTypeDto } from "../type-dto";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDict;
    Extends: ApiTypeDto[];
}
