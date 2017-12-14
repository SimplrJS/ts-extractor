import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiBaseItemDto } from "../api-base-item-dto";

export interface ApiSourceFileDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.SourceFile;
    Members: ApiItemReferenceTuple;
}
