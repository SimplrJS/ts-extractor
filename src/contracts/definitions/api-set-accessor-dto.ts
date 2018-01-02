import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiItemReference } from "../api-item-reference";

export interface ApiSetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.SetAccessor;
    Parameter: ApiItemReference | undefined;
}
