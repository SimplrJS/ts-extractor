import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";

export interface ApiTypeDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReferenceDictionary;
    Type: TypeDto;
}
