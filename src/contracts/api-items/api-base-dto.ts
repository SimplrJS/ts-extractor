import * as ts from "typescript";
import { ApiItemType } from "./api-item-type";

export interface ApiBaseDto {
    ApiType: ApiItemType;
    Kind: ts.SyntaxKind;
    KindString: string;
}
