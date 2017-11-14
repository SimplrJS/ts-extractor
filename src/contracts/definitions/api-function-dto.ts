import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiFunctionDto extends ApiCallableDto {
    ApiKind: ApiItemKinds.Function;
}
