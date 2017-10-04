import { ApiItemDto } from "./api-item-dto";
import { ApiItemReferenceDict } from "./api-item-reference-dict";

export interface ApiFunctionDto extends ApiItemDto {
    Parameters: ApiItemReferenceDict;
    ReturnType: string;
}
