import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiConstructDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Construct;
    Parameters: ApiItemReferenceDictionary;
}
