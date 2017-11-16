import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiClassDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Class;
    TypeParameters: ApiItemReferenceTuple;
    Members: ApiItemReferenceTuple;
    Extends?: TypeDto;
    Implements: TypeDto[];
    IsAbstract: boolean;
}
