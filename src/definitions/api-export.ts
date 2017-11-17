import * as ts from "typescript";
import * as path from "path";
import { LogLevel } from "simplr-logger";

import { Logger } from "../utils/logger";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFile } from "./api-source-file";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiExportDto } from "../contracts/definitions/api-export-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiExport extends ApiItem<ts.ExportDeclaration, ApiExportDto> {
    private getExportPath(): string {
        if (this.apiSourceFile == null) {
            ApiHelpers.LogWithDeclarationPosition(LogLevel.Warning, this.Declaration, "Exported source file is not found!");
            // This should not happen, because we run Semantic Diagnostics before extraction.
            throw new Error("Exported source file is not found!");
        }

        const projectDirectory = this.Options.ExtractorOptions.ProjectDirectory;
        const declarationFileName = this.apiSourceFile.Declaration.fileName;
        return path
            .relative(projectDirectory, declarationFileName)
            .split(path.sep)
            .join("/");
    }

    private members: ApiItemReferenceTuple = [];
    private apiSourceFile: ApiSourceFile | undefined;

    protected OnGatherData(): void {
        // Extract members from Source file.
        const sourceFileDeclaration = TSHelpers.GetSourceFileFromExport(this.Declaration, this.Options.Program);
        if (sourceFileDeclaration == null) {
            return;
        }
        const sourceFileSymbol = TSHelpers.GetSymbolFromDeclaration(sourceFileDeclaration, this.TypeChecker);
        if (sourceFileSymbol == null) {
            return;
        }
        this.apiSourceFile = new ApiSourceFile(sourceFileDeclaration, sourceFileSymbol, this.Options);
        this.apiSourceFile.GatherData();

        this.members = this.apiSourceFile.OnExtract().Members;
    }

    public OnExtract(): ApiExportDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const exportPath: string = this.getExportPath();

        return {
            ApiKind: ApiItemKinds.Export,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Members: this.members,
            ExportPath: exportPath
        };
    }
}
