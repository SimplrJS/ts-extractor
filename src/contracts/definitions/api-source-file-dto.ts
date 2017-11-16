import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiSourceFileDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.SourceFile;
    Path: string;
    Members: ApiItemReferenceTuple;
}
