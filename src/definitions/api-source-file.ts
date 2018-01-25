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
    private location: ApiItemLocationDto;
    private members: ApiItemReference[];

    private getFileName(): string {
        return path.basename(this.Declaration.fileName);
    }

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Members
        this.members = ApiHelpers.GetItemsIdsFromSymbolsMap(this.Symbol.exports, this.Options);
    }

    public OnExtract(): ApiSourceFileDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const name: string = this.getFileName();

        return {
            ApiKind: ApiItemKinds.SourceFile,
            Name: name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            Members: this.members,
            _ts: this.GetTsDebugInfo()
        };
    }
}
