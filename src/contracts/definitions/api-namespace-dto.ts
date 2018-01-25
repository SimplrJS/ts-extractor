import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKind } from "../api-item-kind";

export interface ApiNamespaceDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Namespace | ApiItemKind.ImportNamespace;
    Members: ApiItemReference[];
}
