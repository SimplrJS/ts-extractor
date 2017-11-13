import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiPropertyDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Property;
    IsOptional: boolean;
    Type: TypeDto;
}
