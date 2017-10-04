import * as ts from "typescript";
import { ApiItemType } from "./api-item-type";

export interface ApiItemDto {
    Name: string;
    ApiType: ApiItemType;
    Kind: ts.SyntaxKind;
    KindString: string;
}
