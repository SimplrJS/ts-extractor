import { ApiItemType } from "./api-item-type";

export interface ApiTypeBaseDto {
    ApiType: ApiItemType;
    Reference?: string;
    Text: string;
}

export interface ApiTypeDto extends ApiTypeBaseDto {
    Generics?: ApiTypeDto[];
}
