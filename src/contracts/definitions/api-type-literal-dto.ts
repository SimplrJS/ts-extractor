import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeLiteralDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.TypeLiteral;
    Members: ApiItemReferenceDictionary;
}
