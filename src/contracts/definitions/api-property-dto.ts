import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Property;
    IsOptional: boolean;
    IsReadonly: boolean;
    Type: ApiType;
}
