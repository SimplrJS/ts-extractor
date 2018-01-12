import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiIndexDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Index;
    Parameter: string;
    IsReadonly: boolean;
    Type: ApiType;
}
