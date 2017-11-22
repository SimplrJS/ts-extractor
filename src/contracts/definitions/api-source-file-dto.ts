import * as ts from "typescript";
import { ApiItemReferenceTuple } from "../api-item-reference-tuple";
import { ApiItemKinds } from "../api-item-kinds";

export interface ApiSourceFileDto {
    Name: string;
    Kind: ts.SyntaxKind;
    KindString: string;
    Path: string;
    ApiKind: ApiItemKinds.SourceFile;
    Members: ApiItemReferenceTuple;
}
