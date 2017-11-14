import { ApiBaseItemDto } from "../api-base-item-dto";
import { TypeDto } from "../type-dto";
import { ApiItemKinds } from "../api-item-kinds";

export enum ApiVariableDeclarationType {
    Var = "var",
    Let = "let",
    Const = "const"
}

export interface ApiVariableDto extends ApiBaseItemDto {
    ApiKind: ApiItemKinds.Variable;
    Type: TypeDto;
    VariableDeclarationType: ApiVariableDeclarationType;
}
