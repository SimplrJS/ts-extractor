import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiEnumDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Enum;
    IsConst: boolean;
    Members: ApiItemReference[];
}
