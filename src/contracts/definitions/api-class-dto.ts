import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dict";
import { TypeDto } from "../type-dto";

export interface ApiClassDto extends ApiBaseItemDto {
    Members: ApiItemReferenceDictionary;
    Extends?: TypeDto;
    Implements: TypeDto[];
    IsAbstract: boolean;
}
