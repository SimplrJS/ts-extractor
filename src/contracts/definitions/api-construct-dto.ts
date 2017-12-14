import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuplesList } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiConstructDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Construct;
    IsOverloadBase: boolean;
    Parameters: ApiItemReferenceTuplesList;
}
