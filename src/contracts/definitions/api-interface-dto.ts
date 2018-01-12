import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiType } from "../api-type";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiInterfaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Interface;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends: ApiType[];
}
