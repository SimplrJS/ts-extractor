import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiMethodDto extends ApiCallableDto {
    ApiKind: ApiItemKinds.Method;
    IsOptional: boolean;
}
