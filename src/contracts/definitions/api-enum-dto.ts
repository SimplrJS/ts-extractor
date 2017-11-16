import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiEnumDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Enum;
    Members: ApiItemReferenceTuple;
}
