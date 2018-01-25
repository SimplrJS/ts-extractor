import { ApiCallableDto } from "../api-callable-dto";
import { ApiItemKind } from "../api-item-kind";

export interface ApiFunctionTypeDto extends ApiCallableDto {
    ApiKind: ApiItemKind.FunctionType | ApiItemKind.ArrowFunction | ApiItemKind.FunctionExpression;
}
