import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dict";
import { TypeDto } from "../type-dto";

export interface ApiFunctionDto extends ApiBaseItemDto {
    Parameters: ApiItemReferenceDictionary;
    ReturnType?: TypeDto;
}
