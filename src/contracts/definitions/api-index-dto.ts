import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKind } from "../api-item-kind";

export interface ApiIndexDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Index;
    Parameter: string;
    IsReadonly: boolean;
    Type: ApiType;
}
