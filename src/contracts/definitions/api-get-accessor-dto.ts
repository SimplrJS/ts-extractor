import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKind } from "../api-item-kind";
import { AccessModifier } from "../access-modifier";
import { ApiType } from "../api-type";

export interface ApiGetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.GetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Type: ApiType;
}
