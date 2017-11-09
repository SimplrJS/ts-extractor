import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { TypeDto } from "../type-dto";

export interface ApiParameterDto extends ApiBaseItemDto {
    Type: TypeDto;
    IsSpread: boolean;
    IsOptional: boolean;
}
