import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceTuplesList } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiExportDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Export;
    Members: ApiItemReferenceTuplesList;
    ExportPath: string | undefined;
}
