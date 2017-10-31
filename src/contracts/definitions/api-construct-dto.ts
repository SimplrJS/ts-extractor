import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { AccessModifier } from "../access-modifier";

export interface ApiConstructorDto extends ApiBaseItemDto {
    Parameters: ApiItemReferenceDict;
}
