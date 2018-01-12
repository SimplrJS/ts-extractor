import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiType } from "../api-type";

export interface ApiMappedDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Mapped;
    TypeParameter: string | undefined;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}
