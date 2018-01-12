import { ApiBaseItemDto } from "./api-base-item-dto";
import { ApiItemReference } from "./api-item-reference";
import { ApiType } from "./api-type";

export interface ApiCallableDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReference[];
    Parameters: ApiItemReference[];
    IsOverloadBase: boolean;
    ReturnType?: ApiType;
}
