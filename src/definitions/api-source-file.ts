import * as ts from "typescript";
import * as path from "path";

import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiSourceFileDto } from "../contracts/definitions/api-source-file-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiVariable } from "./api-variable";

export class ApiSourceFile extends ApiItem<ts.SourceFile, ApiSourceFileDto> {
    constructor(sourceFile: ts.SourceFile, symbol: ts.Symbol, options: ApiItemOptions) {
        super(sourceFile, symbol, options);

        this.members = ApiHelpers.GetItemsFromSymbolsIds(symbol.exports, this.Options);
    }

    private members: ApiItemReferenceDict;

    private getFileName(): string {
        return path.basename(this.Declaration.fileName);
    }

    private getPath(): string {
        return path.relative(this.Options.ProjectDirectory, this.Declaration.fileName).split(path.sep).join("/");
    }

    public Extract(): ApiSourceFileDto {
        return {
            ApiKind: ApiItemKinds.SourceFile,
            Name: this.getFileName(),
            Path: this.getPath(),
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: this.GetItemMeta(),
            Members: this.members
        };
    }
}
