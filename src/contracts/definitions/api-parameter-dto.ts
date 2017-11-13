import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Parameter;
    Type: TypeDto;
    IsSpread: boolean;
    IsOptional: boolean;
}
