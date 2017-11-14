import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiEnumDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Enum;
    Members: ApiItemReferenceDictionary;
}
