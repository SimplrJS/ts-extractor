import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKind } from "../api-item-kind";

export interface ApiTypeLiteralDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.TypeLiteral | ApiItemKind.ObjectLiteral;
    Members: ApiItemReference[];
}
