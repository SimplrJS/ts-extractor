import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKind } from "../api-item-kind";

export interface ApiTypeParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.TypeParameter;
    ConstraintType: ApiType | undefined;
    DefaultType: ApiType | undefined;
}
