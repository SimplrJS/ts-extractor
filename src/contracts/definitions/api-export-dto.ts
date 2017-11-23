import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Export;
    Members: ApiItemReferenceTuple;
    ExportPath: string | undefined;
}
