import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiType } from "../api-type";
import { ApiItemKind } from "../api-item-kind";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Interface;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends: ApiType[];
}
