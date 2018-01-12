import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Parameter;
    Type: ApiType;
    IsSpread: boolean;
    Initializer: string | undefined;
    IsOptional: boolean;
}
