import * as ts from "typescript";
import * as path from "path";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFileDto } from "../contracts/definitions/api-source-file-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiItemReferenceDictionary } from "../contracts/api-item-reference-dictionary";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiVariable } from "./api-variable";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiSourceFile extends ApiItem<ts.SourceFile, ApiSourceFileDto> {
    constructor(sourceFile: ts.SourceFile, symbol: ts.Symbol, options: ApiItemOptions) {
        super(sourceFile, symbol, options);

        this.members = ApiHelpers.GetItemsIdsFromSymbols(symbol.exports, this.Options);
    }

    private members: ApiItemReferenceDictionary;

    private getFileName(): string {
        return path.basename(this.Declaration.fileName);
    }

    private getPath(): string {
        return path.relative(this.Options.ExtractorOptions.ProjectDirectory, this.Declaration.fileName)
            .split(path.sep).join(this.Options.ExtractorOptions.OutputPathSeparator);
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
