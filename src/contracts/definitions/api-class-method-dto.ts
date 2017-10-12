import { ApiMethodDto } from "./api-method-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { AccessModifier } from "../access-modifier";

export interface ApiClassMethodDto extends ApiMethodDto {
    AccessModifier: AccessModifier;
    IsAbstract: boolean;
    IsStatic: boolean;
}
