import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiCallDto extends ApiCallableDto {
    ApiKind: ApiItemKinds.Call;
}
