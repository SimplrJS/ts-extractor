import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiNamespaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Namespace;
    Members: ApiItemReferenceDictionary;
}
