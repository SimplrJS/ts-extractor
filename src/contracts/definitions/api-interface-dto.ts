import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Interface;
    TypeParameters: ApiItemReferenceDictionary;
    Members: ApiItemReferenceDictionary;
    Extends: TypeDto[];
}
