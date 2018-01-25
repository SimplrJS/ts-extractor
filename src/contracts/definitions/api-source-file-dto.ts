import { ApiItemReference } from "../api-item-reference";
import { ApiItemKind } from "../api-item-kind";
import { ApiBaseItemDto } from "../api-base-item-dto";

export interface ApiSourceFileDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.SourceFile;
    Members: ApiItemReference[];
}
