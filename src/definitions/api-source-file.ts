import * as ts from "typescript";
import * as path from "path";

import { ApiItem } from "../abstractions/api-item";
import { ApiSourceFileDto } from "../contracts/definitions/api-source-file-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiHelpers } from "../api-helpers";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiSourceFile extends ApiItem<ts.SourceFile, ApiSourceFileDto> {
    private members: ApiItemReferenceTuple;

    private getFileName(): string {
        return path.basename(this.Declaration.fileName);
    }

    private getPath(): string {
        const relativePath = path.relative(this.Options.ExtractorOptions.ProjectDirectory, this.Declaration.fileName);
        return ApiHelpers.StandardizeRelativePath(relativePath, this.Options);
    }

    protected OnGatherData(): void {
        this.members = ApiHelpers.GetItemsIdsFromSymbols(this.Symbol.exports, this.Options);
    }

    public OnExtract(): ApiSourceFileDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.SourceFile,
            Name: this.getFileName(),
            Path: this.getPath(),
            Kind: this.Declaration.kind,
            Metadata: metadata,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members
        };
    }
}
