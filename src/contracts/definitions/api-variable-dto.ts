import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKind } from "../api-item-kind";

export enum ApiVariableDeclarationType {
    Var = "var",
    Let = "let",
    Const = "const"
}

export interface ApiVariableDto extends ApiBaseItemDto {
    ApiKind: ApiItemKind.Variable;
    Type: ApiType;
    VariableDeclarationType: ApiVariableDeclarationType;
}
