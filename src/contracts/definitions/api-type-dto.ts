import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Type;
    TypeParameters: ApiItemReferenceDictionary;
    Type: TypeDto;
}
