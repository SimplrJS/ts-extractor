import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemReferenceDict } from "../api-item-reference-dict";

export interface ApiFunctionDto extends ApiBaseItemDto {
    Parameters: ApiItemReferenceDict;
    ReturnType: string;
}
