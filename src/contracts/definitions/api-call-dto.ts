import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKind } from "../api-item-kind";

export interface ApiCallDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Call;
}
