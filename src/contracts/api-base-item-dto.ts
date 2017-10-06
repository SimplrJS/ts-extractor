import * as ts from "typescript";
import { ApiItemTypes } from "./api-item-types";

/**
 * This is the interface for definitions like: interface, class or enum etc.
 */
export interface ApiBaseItemDto {
    Name: string;
    ApiType: ApiItemTypes;
    Kind: ts.SyntaxKind;
    KindString: string;
}
