import { ApiItemDto } from "./api-item-dto";
import { ApiTypeDto } from "./api-type-dto";

export interface ApiVariableDto extends ApiItemDto {
    Type: ApiTypeDto;
}
