import * as ts from "typescript";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";
import { ApiMetadataDto } from "../api-metadata-dto";

export interface ApiSourceFileDto {
    Name: string;
    Kind: ts.SyntaxKind;
    KindString: string;
    Path: string;
    ApiKind: ApiItemKinds.SourceFile;
    Metadata: ApiMetadataDto;
    Members: ApiItemReferenceTuple;
}
