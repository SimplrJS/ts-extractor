import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiImportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Import;
    SourceFileId: string | undefined;
    ImportPath: string | undefined;
}
