import { ApiBaseItemDto } from "../api-base-item-dto";
import { AccessModifier } from "../access-modifier";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiClassConstructorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.ClassConstructor;
    Parameters: ApiItemReferenceDictionary;
    AccessModifier: AccessModifier;
}
