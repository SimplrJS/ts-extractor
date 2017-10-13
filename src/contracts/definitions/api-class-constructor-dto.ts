import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { AccessModifier } from "../access-modifier";

export interface ApiClassConstructorDto extends ApiBaseItemDto {
    Parameters: ApiItemReferenceDict;
    AccessModifier: AccessModifier;
}
