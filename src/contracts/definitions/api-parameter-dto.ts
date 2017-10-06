import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";

export interface ApiParameterDto extends ApiBaseItemDto {
    ReturnType: string;
}
