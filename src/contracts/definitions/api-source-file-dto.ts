import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";

export interface ApiSourceFileDto extends ApiBaseItemDto {
    Path: string;
    Members: ApiItemReferenceDictionary;
}
