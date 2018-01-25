import { AccessModifier } from "../access-modifier";
import { ApiItemKind } from "../api-item-kind";
import { ApiCallableDto } from "../api-callable-dto";

export interface ApiClassConstructorDto extends ApiCallableDto {
    ApiKind: ApiItemKind.ClassConstructor;
    AccessModifier: AccessModifier;
}
