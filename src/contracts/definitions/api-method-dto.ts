import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiCallableDto } from "../api-callable-dto";

// tslint:disable-next-line:no-empty-interface
export interface ApiMethodDto extends ApiCallableDto {
    IsOptional: boolean;
}
