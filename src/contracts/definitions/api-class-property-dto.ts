import { ApiBaseItemDto } from "../api-base-item-dto";
import { AccessModifier } from "../access-modifier";
import { ApiItemKind } from "../api-item-kind";
import { ApiType } from "../api-type";

export interface ApiClassPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.ClassProperty;
    AccessModifier: AccessModifier;
    IsAbstract: boolean;
    IsStatic: boolean;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}
