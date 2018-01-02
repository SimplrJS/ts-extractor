import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";
import { TypeDto } from "../type-dto";
import { AccessModifier } from "../access-modifier";

export interface ApiGetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.GetAccessor;
    IsAbstract: boolean;
    IsStatic: boolean;
    AccessModifier: AccessModifier;
    Type: TypeDto;
}
