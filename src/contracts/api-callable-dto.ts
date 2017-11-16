import { ApiBaseItemDto } from "./api-base-item-dto";
import { ApiItemReferenceTuple } from "./api-item-reference-tuple";
import { TypeDto } from "./type-dto";
import { ApiItemKinds } from "./api-item-kinds";

export interface ApiCallableDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReferenceTuple;
    Parameters: ApiItemReferenceTuple;
    ReturnType?: TypeDto;
}
