import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKind } from "../api-item-kind";

export interface ApiMethodDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Method;
    IsOptional: boolean;
}
