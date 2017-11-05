import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dict";
import { AccessModifier } from "../access-modifier";

export interface ApiConstructDto extends ApiBaseItemDto {
    Parameters: ApiItemReferenceDictionary;
}
