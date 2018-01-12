import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiType } from "../api-type";

export interface ApiClassDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Class;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends?: ApiType;
    Implements: ApiType[];
    IsAbstract: boolean;
}
