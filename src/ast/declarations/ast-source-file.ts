import * as ts from "typescript";
import * as path from "path";

import { AstItemGatherMembersOptions, AstItemOptions } from "../../abstractions/ast-item-base";
import { AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { TsHelpers } from "../../ts-helpers";
import { Helpers } from "../../utils/helpers";
import { AstDeclarationBase } from "../ast-declaration-base";

export class AstSourceFile extends AstDeclarationBase<ts.SourceFile, {}> {
    constructor(options: AstItemOptions, sourceFile: ts.SourceFile, private _packageName?: string) {
        super(options, sourceFile);
    }

    public readonly itemKind: AstItemKind = AstItemKind.SourceFile;

    public getParentId(): string | undefined {
        return undefined;
    }

    public getId(): string {
        const filePath = path.relative(this.options.projectDirectory, this.item.fileName);
        return `${this.packageName}/${filePath}`;
    }

    public getName(): string {
        const relativePath = path.relative(this.options.projectDirectory, path.extname(this.item.fileName));

        return Helpers.removeExt(relativePath);
    }

    public get packageName(): string {
        if (this._packageName == null) {
            // TODO: Resolve package-name by going up file path and finding package.json.
            this._packageName = "___@scope/package-name";
        }

        return this._packageName;
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
