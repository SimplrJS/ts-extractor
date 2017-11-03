import * as ts from "typescript";

export interface ApiMetadataDto {
    DocumentationComment: DocumentationCommentsItem[];
    JSDocTags: JSDocTagItem[];
}

export type DocumentationCommentsItem = ts.SymbolDisplayPart;
export type JSDocTagItem = ts.JSDocTagInfo;
