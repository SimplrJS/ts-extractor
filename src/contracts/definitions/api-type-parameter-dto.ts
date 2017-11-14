import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiTypeParameterDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.TypeParameter;
    ConstraintType: TypeDto | undefined;
    DefaultType: TypeDto | undefined;
}
