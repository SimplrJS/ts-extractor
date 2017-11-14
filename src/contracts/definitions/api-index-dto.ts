import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiIndexDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Index;
    Parameter: string;
    Type: TypeDto;
}
