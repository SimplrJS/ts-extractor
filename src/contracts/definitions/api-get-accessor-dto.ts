import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiGetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.GetAccessor;
}
