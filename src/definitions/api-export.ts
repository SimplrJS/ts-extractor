import * as ts from "typescript";
import * as path from "path";

import { Logger, LogLevel } from "../utils/logger";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFile } from "./api-source-file";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiExportDto } from "../contracts/definitions/api-export-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

export class ApiExport extends ApiItem<ts.ExportDeclaration, ApiExportDto> {
    constructor(declaration: ts.ExportDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Extract members from Source file.
        const sourceFileDeclaration = TSHelpers.GetSourceFileFromExport(declaration, options.Program);
        if (sourceFileDeclaration == null) {
            return;
        }
        const sourceFileSymbol = TSHelpers.GetSymbolFromDeclaration(sourceFileDeclaration, this.TypeChecker);
        if (sourceFileSymbol == null) {
            return;
        }
        this.apiSourceFile = new ApiSourceFile(sourceFileDeclaration, sourceFileSymbol, options);

        this.members = this.apiSourceFile.Extract().Members;
    }

    public HasSourceFileMembers(): boolean {
        return Object.keys(this.members).length > 0;
    }

    private getExportPath(): string {
        if (this.apiSourceFile == null) {
            ApiHelpers.LogWithDeclarationPosition(LogLevel.Warning, this.Declaration, "Exported source file is not found!");
            // This should not happen, because we run Semantic Diagnostics before extraction.
            throw new Error("Exported source file is not found!");
        }

        return path.relative(this.Options.ProjectDirectory, this.apiSourceFile.Declaration.fileName).split(path.sep).join("/");
    }

    private members: ApiItemReferenceDict = {};
    private apiSourceFile: ApiSourceFile | undefined;

    public Extract(): ApiExportDto {
        return {
            ApiKind: ApiItemKinds.Class,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: this.GetItemMeta(),
            Members: this.members,
            ExportPath: this.getExportPath()
        };
    }
}
