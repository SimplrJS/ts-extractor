import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";

export interface ApiPropertyDto extends ApiBaseItemDto {
    IsOptional: boolean;
    Type: TypeDto;
}
