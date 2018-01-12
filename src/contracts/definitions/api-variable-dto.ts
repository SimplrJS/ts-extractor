import { ApiBaseItemDto } from "../api-base-item-dto";
import { ApiType } from "../api-type";
import { ApiItemKinds } from "../api-item-kinds";

export enum ApiVariableDeclarationType {
    Var = "var",
    Let = "let",
    Const = "const"
}

export interface ApiVariableDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Variable;
    Type: ApiType;
    VariableDeclarationType: ApiVariableDeclarationType;
}
