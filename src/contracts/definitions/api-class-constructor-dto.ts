import { ApiConstructorDto } from "./api-construct-dto";
import { AccessModifier } from "../access-modifier";

export interface ApiClassConstructorDto extends ApiConstructorDto {
    AccessModifier: AccessModifier;
}
