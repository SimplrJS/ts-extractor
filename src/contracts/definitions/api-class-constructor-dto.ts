import { ApiBaseItemDto } from "../api-base-item-dto";
import { AccessModifier } from "../access-modifier";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiClassConstructorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.ClassConstructor;
    IsOverloadBase: boolean;
    Parameters: ApiItemReference[];
    AccessModifier: AccessModifier;
}
