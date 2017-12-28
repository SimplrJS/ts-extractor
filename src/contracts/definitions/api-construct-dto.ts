import { ApiItemKinds } from "../api-item-kinds";
import { ApiCallableDto } from "../api-callable-dto";

export interface ApiConstructDto extends ApiCallableDto {
    ApiKind: ApiItemKinds.Construct;
}
