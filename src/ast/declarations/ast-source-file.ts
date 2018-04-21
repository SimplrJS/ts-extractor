import * as ts from "typescript";
import * as path from "path";

import { AstItemGatherMembersOptions, AstItemOptions } from "../../abstractions/ast-item-base";
import { AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { Helpers } from "../../utils/helpers";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";
import { AstDeclarationIdentifiers } from "../../contracts/ast-declaration";

export interface AstSourceFileIdentifiers extends AstDeclarationIdentifiers {
    packageName?: string;
}

export class AstSourceFile extends AstDeclarationBase<ts.SourceFile, {}> {
    constructor(
        options: AstItemOptions,
        sourceFile: ts.SourceFile,
        symbol: ts.Symbol,
        protected readonly identifiers: AstSourceFileIdentifiers = {}
    ) {
        super(options, sourceFile, symbol);
    }

    public readonly itemKind: AstItemKind = AstItemKind.SourceFile;

    public getParentId(): string | undefined {
        return undefined;
    }

    public getId(): string {
        return `${this.packageName}/${this.name}`;
    }

    public get name(): string {
        const relativePath = path.relative(this.options.projectDirectory, this.item.fileName);

        return Helpers.removeExt(relativePath);
    }

    private _packageName: string | undefined;
    public get packageName(): string {
        if (this._packageName == null) {
            if (this.identifiers.packageName != null) {
                this._packageName = this.identifiers.packageName;
            } else {
                // TODO: Resolve package-name by going up file path and finding package.json.
                this._packageName = "___@scope/package-name";
            }
        }

        return this._packageName;
    }

    protected onExtract(): {} {
        return {};
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstItemMemberReference[] {
        const membersReferences: AstItemMemberReference[] = [];
        const sourceFileAstSymbol = this.getParent();

        if (sourceFileAstSymbol == null) {
            this.logger.Error(`[${this.item.fileName}] Failed to resolve source file symbol.`);
            return membersReferences;
        }
        if (sourceFileAstSymbol.item.exports == null) {
            this.logger.Error(`[${this.item.fileName}] No exported members were found in source file.`);
            return membersReferences;
        }

        sourceFileAstSymbol.item.exports.forEach(symbol => {
            const astSymbol = new AstSymbol(this.options, symbol, this.getId());

            if (!this.options.itemsRegistry.hasItem(symbol)) {
                options.addAstItemToRegistry(astSymbol);
            }

            membersReferences.push({ id: astSymbol.getId() });
        });

        return membersReferences;
    }
}
