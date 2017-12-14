import * as ts from "typescript";
import * as path from "path";

import { ApiItem } from "../abstractions/api-item";
import { ApiSourceFileDto } from "../contracts/definitions/api-source-file-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiHelpers } from "../api-helpers";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts";

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
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.SourceFile,
            Name: this.getFileName(),
            Path: this.getPath(),
            Kind: this.Declaration.kind,
            Metadata: metadata,
            Location: location,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members
        };
    }
}
