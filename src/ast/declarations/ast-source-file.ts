import * as ts from "typescript";
import * as path from "path";

import { AstItemGatherMembersOptions, AstItemOptions, AstItemBase } from "../../abstractions/ast-item-base";
import { AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { TsHelpers } from "../../ts-helpers";

export class AstSourceFile extends AstItemBase<ts.SourceFile, {}> {
    constructor(options: AstItemOptions, sourceFile: ts.SourceFile, private packageName?: string) {
        super(options, sourceFile);
    }

    public static readonly itemKind: AstItemKind = AstItemKind.SourceFile;

    public get itemKind(): AstItemKind {
        return AstSourceFile.itemKind;
    }

    public getId(): string {
        const filePath = path.relative(this.options.projectDirectory, this.item.fileName);
        return `${this.parentId}/${filePath}`;
    }

    public static getName(sourceFile: ts.SourceFile, projectDirectory?: string): string {
        if (projectDirectory == null) {
            return path.basename(sourceFile.fileName, path.extname(sourceFile.fileName));
        }

        return path.relative(projectDirectory, path.extname(sourceFile.fileName));
    }

    public get parentId(): string {
        if (this.packageName == null) {
            // TODO: Resolve package-name by going up file path and finding package.json.
            this.packageName = "___@scope/package-name";
        }

        return this.packageName;
    }

    protected onExtract(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        const sourceFileSymbol = TsHelpers.GetSymbolFromDeclaration(this.item, this.typeChecker);

        if (sourceFileSymbol == null) {
            this.logger.Error(`[${this.item.fileName}] Failed to resolve source file symbol.`);
            return membersReferences;
        }
        if (sourceFileSymbol.exports == null) {
            this.logger.Error(`[${this.item.fileName}] No exported members were found in source file.`);
            return membersReferences;
        }

        sourceFileSymbol.exports.forEach(symbol => {
            console.log("Symbol", symbol);
        });

        return membersReferences;
    }
}
