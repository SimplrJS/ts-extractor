import * as ts from "typescript";
import * as path from "path";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFileDto } from "../contracts/definitions/api-source-file-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiVariable } from "./api-variable";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiSourceFile extends ApiItem<ts.SourceFile, ApiSourceFileDto> {
    private members: ApiItemReferenceTuple;

    private getFileName(): string {
        return path.basename(this.Declaration.fileName);
    }

    private getPath(): string {
        return path.relative(this.Options.ExtractorOptions.ProjectDirectory, this.Declaration.fileName)
            .split(path.sep).join(this.Options.ExtractorOptions.OutputPathSeparator);
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
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Members: this.members
        };
    }
}
