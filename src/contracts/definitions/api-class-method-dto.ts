import { AccessModifier } from "../access-modifier";
import { ApiItemKind } from "../api-item-kind";
import { ApiCallableDto } from "../api-callable-dto";

export interface ApiClassMethodDto extends ApiCallableDto {
    ApiKind: ApiItemKind.ClassMethod;
    AccessModifier: AccessModifier;
    IsOptional: boolean;
    IsAbstract: boolean;
    IsAsync: boolean;
    IsStatic: boolean;
}
