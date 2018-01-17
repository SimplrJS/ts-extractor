import { AccessModifier } from "../access-modifier";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiCallableDto } from "../api-callable-dto";

export interface ApiClassConstructorDto extends ApiCallableDto {
    ApiKind: ApiItemKinds.ClassConstructor;
    AccessModifier: AccessModifier;
}
