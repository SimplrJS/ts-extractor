import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiNamespaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Namespace;
    Members: ApiItemReferenceTuple;
}
