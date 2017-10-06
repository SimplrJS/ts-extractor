import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiTypeDto } from "../type-dto";

export interface ApiVariableDto extends ApiBaseItemDto {
    Type: ApiTypeDto;
}
