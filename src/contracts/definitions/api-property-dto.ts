import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKind } from "../api-item-kind";

export interface ApiPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Property;
    IsOptional: boolean;
    IsReadonly: boolean;
    Type: ApiType;
}
