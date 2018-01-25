import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKind } from "../api-item-kind";

export interface ApiParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Parameter;
    Type: ApiType;
    IsSpread: boolean;
    Initializer: string | undefined;
    IsOptional: boolean;
}
