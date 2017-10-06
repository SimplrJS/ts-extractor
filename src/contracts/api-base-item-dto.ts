import * as ts from "typescript";
import { ApiItemKinds } from "./api-item-kinds";

/**
 * This is the interface for definitions like: interface, class or enum etc.
 */
export interface ApiBaseItemDto {
    Name: string;
    ApiKind: ApiItemKinds;
    Kind: ts.SyntaxKind;
    KindString: string;
}
