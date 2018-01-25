import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKind } from "../api-item-kind";

export interface ApiFunctionDto extends ApiCallableDto {
    ApiKind: ApiItemKind.Function;
    IsAsync: boolean;
}
