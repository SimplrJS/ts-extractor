import * as ts from "typescript";
import { ApiItemKinds } from "./api-item-kinds";
import { ApiMetadataDto } from "./api-metadata-dto";
import { ApiItemLocationDto } from "./api-item-location-dto";

export interface TypeScriptTypeDeclarationDebug {
    Kind: ts.SyntaxKind;
    KindString: string;
}

/**
 * This is the interface for definitions like: interface, class or enum etc.
 */
export interface ApiBaseItemDto {
    Name: string;
    ApiKind: ApiItemKinds;
    Metadata: ApiMetadataDto;
    Location: ApiItemLocationDto;
    _ts?: TypeScriptTypeDeclarationDebug;
}
