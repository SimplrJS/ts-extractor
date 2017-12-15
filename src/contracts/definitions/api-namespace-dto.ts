import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiNamespaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Namespace;
    Members: ApiItemReference[];
}
