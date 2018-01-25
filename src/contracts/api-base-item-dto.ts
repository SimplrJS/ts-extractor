import * as ts from "typescript";
import { ApiItemKind } from "./api-item-kind";
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
    ApiKind: ApiItemKind;
    Metadata: ApiMetadataDto;
    Location: ApiItemLocationDto;
    /**
     * Parent reference id.
     */
    ParentId: string | undefined;
    /**
     * TypeScript debug info.
     */
    _ts?: TypeScriptTypeDeclarationDebug;
}
