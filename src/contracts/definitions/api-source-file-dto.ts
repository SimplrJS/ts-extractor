import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDictionary } from "../api-item-reference-dictionary";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiSourceFileDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.SourceFile;
    Path: string;
    Members: ApiItemReferenceDictionary;
}
