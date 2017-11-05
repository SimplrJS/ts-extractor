import { ApiConstructDto } from "./api-construct-dto";
import { AccessModifier } from "../access-modifier";

export interface ApiClassConstructorDto extends ApiConstructDto {
    AccessModifier: AccessModifier;
}
