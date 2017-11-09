import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { TypeDto } from "../type-dto";

export interface ApiClassDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReferenceDictionary;
    Members: ApiItemReferenceDictionary;
    Extends?: TypeDto;
    Implements: TypeDto[];
    IsAbstract: boolean;
}
