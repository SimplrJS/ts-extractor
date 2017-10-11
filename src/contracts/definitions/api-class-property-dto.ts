import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ModifiersDto } from "../modifiers-dto";

export interface ApiClassPropertyDto extends ApiBaseItemDto, ModifiersDto {
    Type: TypeDto;
}
