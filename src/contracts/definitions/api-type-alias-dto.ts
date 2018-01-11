import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiType } from "../api-type";

export interface ApiTypeAliasDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.TypeAlias;
    TypeParameters: ApiItemReference[];
    Type: ApiType;
}
