import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";
import { TypeDto } from "../type-dto";

export interface ApiGetAccessorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.GetAccessor;
    Type: TypeDto;
}
