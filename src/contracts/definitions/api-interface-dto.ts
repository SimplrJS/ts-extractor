import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { TypeDto } from "../type-dto";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDict;
    Extends: TypeDto[];
}
