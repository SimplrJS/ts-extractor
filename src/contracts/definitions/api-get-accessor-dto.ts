import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";
import { AccessModifier } from "../access-modifier";
import { ApiType } from "../api-type";

export interface ApiGetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.GetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Type: ApiType;
}
