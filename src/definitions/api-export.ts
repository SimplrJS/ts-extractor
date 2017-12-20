import * as ts from "typescript";
import * as path from "path";
import { LogLevel } from "simplr-logger";

import { ApiItem } from "../abstractions/api-item";
import { ApiSourceFile } from "./api-source-file";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiExportDto } from "../contracts/definitions/api-export-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiExport extends ApiItem<ts.ExportDeclaration, ApiExportDto> {
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
        // Extract members from Source file.
        const sourceFileDeclaration = TSHelpers.ResolveSourceFile(this.Declaration, this.Options.Program);

        if (sourceFileDeclaration != null) {
            const sourceFileSymbol = TSHelpers.GetSymbolFromDeclaration(sourceFileDeclaration, this.TypeChecker);

            if (sourceFileSymbol != null) {
                this.apiSourceFile = new ApiSourceFile(sourceFileDeclaration, sourceFileSymbol, this.Options);
                this.sourceFileId = this.Options.AddItemToRegistry(this.apiSourceFile);
            }
        }
    }

    public OnExtract(): ApiExportDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const exportPath: string | undefined = this.getExportPath();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Export,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            SourceFileId: this.sourceFileId,
            ExportPath: exportPath
        };
    }
}
