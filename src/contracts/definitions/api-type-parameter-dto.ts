import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.TypeParameter;
    ConstraintType: ApiType | undefined;
    DefaultType: ApiType | undefined;
}
