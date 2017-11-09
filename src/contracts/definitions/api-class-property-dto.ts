import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { AccessModifier } from "../access-modifier";

export interface ApiClassPropertyDto extends ApiBaseItemDto {
    AccessModifier: AccessModifier;
    IsAbstract: boolean;
    IsStatic: boolean;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: TypeDto;
}
