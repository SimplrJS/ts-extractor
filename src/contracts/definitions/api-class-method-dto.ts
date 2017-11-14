import { AccessModifier } from "../access-modifier";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiCallableDto } from "../api-callable-dto";

export interface ApiClassMethodDto extends ApiCallableDto {
    ApiKind: ApiItemKinds.ClassMethod;
    AccessModifier: AccessModifier;
    IsOptional: boolean;
    IsAbstract: boolean;
    IsStatic: boolean;
}
