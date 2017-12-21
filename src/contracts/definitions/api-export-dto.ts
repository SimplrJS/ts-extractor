import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Export;
    SourceFileId: string | undefined;
    ExportPath: string | undefined;
}
