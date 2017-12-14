import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuplesList } from "../api-item-reference-tuple";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Interface;
    TypeParameters: ApiItemReferenceTuplesList;
    Members: ApiItemReferenceTuplesList;
    Extends: TypeDto[];
}
