import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiClassDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Class;
    TypeParameters: ApiItemReference[];
    Members: ApiItemReference[];
    Extends?: TypeDto;
    Implements: TypeDto[];
    IsAbstract: boolean;
}
