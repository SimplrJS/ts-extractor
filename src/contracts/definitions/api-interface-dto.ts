import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { TypeDto } from "../type-dto";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReferenceDictionary;
    Members: ApiItemReferenceDictionary;
    Extends: TypeDto[];
}
