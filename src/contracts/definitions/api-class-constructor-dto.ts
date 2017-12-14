import { ApiBaseItemDto } from "../api-base-item-dto";
import { AccessModifier } from "../access-modifier";
import { ApiItemReferenceTuplesList } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiClassConstructorDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.ClassConstructor;
    IsOverloadBase: boolean;
    Parameters: ApiItemReferenceTuplesList;
    AccessModifier: AccessModifier;
}
