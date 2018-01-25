import { ApiItemKind } from "../api-item-kind";
import { ApiCallableDto } from "../api-callable-dto";

export interface ApiConstructDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Construct;
}
