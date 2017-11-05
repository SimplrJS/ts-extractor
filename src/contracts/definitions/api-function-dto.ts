import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dict";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiFunctionDto extends ApiBaseItemDto {
    TypeParameters: ApiItemReferenceDictionary;
    Parameters: ApiItemReferenceDictionary;
    ReturnType?: TypeDto;
}
