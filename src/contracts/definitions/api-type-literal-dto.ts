import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeLiteralDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.TypeLiteral;
    Members: ApiItemReference[];
}
