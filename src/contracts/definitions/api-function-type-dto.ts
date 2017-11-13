import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiFunctionTypeDto extends ApiCallableDto {
    ApiKind: ApiItemKinds.Function;
}
