import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuplesList } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeLiteralDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.TypeLiteral;
    Members: ApiItemReferenceTuplesList;
}
