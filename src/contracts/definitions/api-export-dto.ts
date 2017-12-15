import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReference } from "../api-item-reference";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Export;
    Members: ApiItemReference[];
    ExportPath: string | undefined;
}
