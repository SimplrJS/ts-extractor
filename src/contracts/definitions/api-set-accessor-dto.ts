import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiSetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.SetAccessor;
}
