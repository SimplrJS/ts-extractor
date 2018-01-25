import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKind } from "../api-item-kind";
import { ApiItemReference } from "../api-item-reference";
import { AccessModifier } from "../access-modifier";

export interface ApiSetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.SetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Parameter: ApiItemReference | undefined;
}
