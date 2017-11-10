import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";

export interface ApiVariableDto extends ApiBaseItemDto {
    Type: TypeDto;
    VariableDeclarationType: ApiVariableDeclarationType;
}

export enum ApiVariableDeclarationType {
    Var = "var",
    Let = "let",
    Const = "const"
}
