import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiItemReference } from "../api-item-reference";
import { AccessModifier } from "../access-modifier";

export interface ApiSetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.SetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Parameter: ApiItemReference | undefined;
}
