import { ApiItemDto } from "./api-item-dto";
import { ApiItemReferenceDict } from "./api-item-reference-dict";
import { ApiTypeDto } from "./api-type-dto";

export interface ApiInterfaceDto extends ApiItemDto {
    Members: ApiItemReferenceDict;
    Extends: ApiTypeDto[];
}
