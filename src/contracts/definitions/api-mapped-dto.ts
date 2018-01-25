import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKind } from "../api-item-kind";
import { ApiType } from "../api-type";

export interface ApiMappedDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Mapped;
    TypeParameter: string | undefined;
    IsReadonly: boolean;
    IsOptional: boolean;
    Type: ApiType;
}
