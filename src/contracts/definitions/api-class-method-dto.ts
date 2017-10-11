import { ApiMethodDto } from "./api-method-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";
import { ModifiersDto } from "../modifiers-dto";

export interface ApiClassMethodDto extends ApiMethodDto, ModifiersDto { }
