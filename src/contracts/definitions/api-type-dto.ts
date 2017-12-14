import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemReferenceTuplesList } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Type;
    TypeParameters: ApiItemReferenceTuplesList;
    Type: TypeDto;
}
