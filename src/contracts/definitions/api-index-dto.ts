import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";

export interface ApiIndexDto extends ApiBaseItemDto {
    Parameter: string;
    Type: TypeDto;
}
