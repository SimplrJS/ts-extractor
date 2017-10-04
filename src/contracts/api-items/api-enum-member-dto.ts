import { ApiItemDto } from "./api-item-dto";
import { ApiItemReferenceDict } from "./api-item-reference-dict";

export interface ApiEnumMemberDto extends ApiItemDto {
    Value: string;
}
