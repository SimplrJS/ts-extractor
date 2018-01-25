import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKind } from "../api-item-kind";
import { ApiType } from "../api-type";

export interface ApiClassDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Class;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends?: ApiType;
    Implements: ApiType[];
    IsAbstract: boolean;
}
