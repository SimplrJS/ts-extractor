import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiEnumMemberDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.EnumMember;
    Value: string;
}
