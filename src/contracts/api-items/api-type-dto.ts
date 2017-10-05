import { ApiBaseDto } from "./api-base-dto";

export interface ApiTypeDto extends ApiBaseDto {
    Reference?: string;
    Generics?: ApiTypeDto[];
    Text: string;
}
