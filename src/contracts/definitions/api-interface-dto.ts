import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dict";
import { TypeDto } from "../type-dto";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDictionary;
    Extends: TypeDto[];
}
