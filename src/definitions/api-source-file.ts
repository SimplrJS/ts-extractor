import * as ts from "typescript";
import * as path from "path";

import { ApiItem } from "../abstractions/api-item";
import { ApiSourceFileDto } from "../contracts/definitions/api-source-file-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiHelpers } from "../api-helpers";

import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts";

export class ApiSourceFile extends ApiItem<ts.SourceFile, ApiSourceFileDto> {
    private members: ApiItemReference[];

    private getFileName(): string {
        return path.basename(this.Declaration.fileName);
    }

    protected OnGatherData(): void {
        this.members = ApiHelpers.GetItemsIdsFromSymbolsMap(this.Symbol.exports, this.Options);
    }

    public OnExtract(): ApiSourceFileDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);
        const name: string = this.getFileName();

        return {
            ApiKind: ApiItemKinds.SourceFile,
            Name: name,
            Kind: this.Declaration.kind,
            Metadata: metadata,
            Location: location,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Members: this.members
        };
    }
}
