import { ApiBaseItemDto } from "./api-base-item-dto";
import { ApiItemReferenceTuplesList } from "./api-item-reference-tuple";
import { TypeDto } from "./type-dto";

export interface ApiCallableDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReferenceTuplesList;
    Parameters: ApiItemReferenceTuplesList;
    IsOverloadBase: boolean;
    ReturnType?: TypeDto;
}
