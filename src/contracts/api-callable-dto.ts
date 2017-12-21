import { ApiBaseItemDto } from "./api-base-item-dto";
import { ApiItemReference } from "./api-item-reference";
import { TypeDto } from "./type-dto";

export interface ApiCallableDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReference[];
    Parameters: ApiItemReference[];
    IsOverloadBase: boolean;
    ReturnType?: TypeDto;
}
