import * as ts from "typescript";
import { ApiItemKinds } from "./api-item-kinds";
import { ApiMetaDto } from "./api-meta-dto";

/**
 * This is the interface for definitions like: interface, class or enum etc.
 */
export interface ApiBaseItemDto {
    Name: string;
    ApiKind: ApiItemKinds;
    Kind: ts.SyntaxKind;
    KindString: string;
    Meta: ApiMetaDto;
}
