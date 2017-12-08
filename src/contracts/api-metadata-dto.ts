import * as ts from "typescript";

export interface ApiMetadataDto {
    DocumentationComment: string;
    JSDocTags: JSDocTagItem[];
}

export type DocumentationCommentsItem = ts.SymbolDisplayPart;
export type JSDocTagItem = ts.JSDocTagInfo;
