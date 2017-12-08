import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiConstructDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Construct;
    IsOverloadBase: boolean;
    Parameters: ApiItemReferenceTuple;
}
