import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";

export interface ApiTypeDto extends ApiBaseItemDto {
    Type: TypeDto;
}
