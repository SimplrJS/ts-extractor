import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKind } from "../api-item-kind";

export interface ApiEnumDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Enum;
    IsConst: boolean;
    Members: ApiItemReference[];
}
