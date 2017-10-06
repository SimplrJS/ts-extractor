import { ApiItemType } from "./api-item-type";

export interface ApiTypeDto {
    ApiType: ApiItemType;
    Reference?: string;
    Generics?: ApiTypeDto[];
    Text: string;
}
