import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiClassDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Class;
    TypeParameters: ApiItemReferenceDictionary;
    Members: ApiItemReferenceDictionary;
    Extends?: TypeDto;
    Implements: TypeDto[];
    IsAbstract: boolean;
}
