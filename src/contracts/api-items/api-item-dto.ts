import * as ts from "typescript";
import { ApiItemType } from "./api-item-type";

/**
 * This is the interface for definitions like: interface, class or enum etc.
 */
export interface ApiItemDto {
    Name: string;
    ApiType: ApiItemType;
    Kind: ts.SyntaxKind;
    KindString: string;
}
