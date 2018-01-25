import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKind } from "../api-item-kind";

export interface ApiEnumMemberDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.EnumMember;
    Value: string;
}
