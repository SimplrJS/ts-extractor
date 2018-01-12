import { ApiBaseItemDto } from "../api-base-item-dto";
import { AccessModifier } from "../access-modifier";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiType } from "../api-type";

export interface ApiClassPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.ClassProperty;
    AccessModifier: AccessModifier;
    IsAbstract: boolean;
    IsStatic: boolean;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}
