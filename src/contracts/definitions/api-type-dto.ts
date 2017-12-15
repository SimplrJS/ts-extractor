import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Type;
    TypeParameters: ApiItemReference[];
    Type: TypeDto;
}
