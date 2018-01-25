import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKind } from "../api-item-kind";
import { ApiType } from "../api-type";

export interface ApiTypeAliasDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.TypeAlias;
    TypeParameters: ApiItemReference[];
    Type: ApiType;
}
