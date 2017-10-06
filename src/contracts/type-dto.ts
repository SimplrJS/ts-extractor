import { ApiItemTypes } from "./api-item-types";

export interface ApiTypeBaseDto {
    Reference?: string;
    Text: string;
}

export interface ApiTypeDto extends ApiTypeBaseDto {
    Generics?: ApiTypeDto[];
}
