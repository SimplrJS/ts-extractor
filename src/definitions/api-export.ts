import * as ts from "typescript";
import * as path from "path";
import { LogLevel } from "simplr-logger";

import { ApiItem } from "../abstractions/api-item";
import { ApiSourceFile } from "./api-source-file";
import { TsHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiDefinitionKind, ApiExportDto } from "../contracts/api-definitions";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiExport extends ApiItem<ts.ExportDeclaration, ApiExportDto> {
    private location: ApiItemLocationDto;
    private getExportPath(): string | undefined {
        if (this.apiSourceFile == null) {
            ApiHelpers.LogWithNodePosition(LogLevel.Warning, this.Declaration, "Exported source file is not found!");
            return undefined;
        }

        const projectDirectory = this.Options.ExtractorOptions.ProjectDirectory;
        const declarationFileName = this.apiSourceFile.Declaration.fileName;
        const exportRelativePath = path.relative(projectDirectory, declarationFileName);

        return ApiHelpers.StandardizeRelativePath(exportRelativePath, this.Options);
    }

    private sourceFileId: string | undefined;
    private apiSourceFile: ApiSourceFile | undefined;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Extract members from Source file.
        const sourceFileDeclaration = TsHelpers.ResolveSourceFile(this.Declaration, this.Options.Program);

        if (sourceFileDeclaration != null && ApiHelpers.ShouldVisit(sourceFileDeclaration, this.Options)) {
            const sourceFileSymbol = TsHelpers.GetSymbolFromDeclaration(sourceFileDeclaration, this.TypeChecker);

            if (sourceFileSymbol != null) {
                this.apiSourceFile = new ApiSourceFile(sourceFileDeclaration, sourceFileSymbol, this.Options);
                this.sourceFileId = this.Options.AddItemToRegistry(this.apiSourceFile);
            }
        }
    }

    public OnExtract(): ApiExportDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const exportPath: string | undefined = this.getExportPath();

        return {
            ApiKind: ApiDefinitionKind.Export,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            SourceFileId: this.sourceFileId,
            ExportPath: exportPath,
            _ts: this.GetTsDebugInfo()
        };
    }
}
