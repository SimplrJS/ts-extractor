import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKind } from "../api-item-kind";

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Export;
    SourceFileId: string | undefined;
    ExportPath: string | undefined;
}
