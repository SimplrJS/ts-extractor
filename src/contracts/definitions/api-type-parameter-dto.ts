import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";

export interface ApiTypeParameterDto extends ApiBaseItemDto {
    ContraintType: TypeDto | undefined;
    DefaultType: TypeDto | undefined;
}
