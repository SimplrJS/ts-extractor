import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";
import * as path from "path";

import {
    AstItemMemberReference,
    AstItemKind,
    GatheredMembersResult,
    AstItemOptions,
    AstItemGatherMembersOptions
} from "../../contracts/ast-item";
import { Helpers } from "../../utils/helpers";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";
import { AstDeclarationIdentifiers } from "../../contracts/ast-declaration";

export interface AstSourceFileIdentifiers extends AstDeclarationIdentifiers {
    packageName?: string;
}

export interface AstSourceFileGatheredResult extends GatheredMembersResult {
    members: AstItemMemberReference[];
}

export class AstSourceFile extends AstDeclarationBase<ts.SourceFile, AstSourceFileGatheredResult, {}> {
    constructor(
        options: AstItemOptions,
        sourceFile: ts.SourceFile,
        symbol: ts.Symbol,
        protected readonly identifiers: AstSourceFileIdentifiers = {}
    ) {
        super(options, sourceFile, symbol);
    }

    public readonly itemKind: AstItemKind = AstItemKind.SourceFile;

    public get parentId(): string | undefined {
        return undefined;
    }

    @LazyGetter()
    public get id(): string {
        return `${this.packageName}/${this.name}`;
    }

    @LazyGetter()
    public get name(): string {
        const relativePath = path.relative(this.options.projectDirectory, this.item.fileName);

        return Helpers.removeExt(relativePath);
    }

    @LazyGetter()
    public get packageName(): string {
        if (this.identifiers.packageName != null) {
            return this.identifiers.packageName;
        }

        // TODO: Resolve package-name by going up file path and finding package.json.
        return "___@scope/package-name";
    }

    protected onExtract(): {} {
        return {};
    }

    protected getDefaultGatheredMembers(): AstSourceFileGatheredResult {
        return {
            members: []
        };
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstSourceFileGatheredResult {
        const result: AstSourceFileGatheredResult = {
            members: []
        };

        if (this.symbol == null || this.symbol.exports == null) {
            this.logger.Error(`[${this.item.fileName}] No exported members were found in source file.`);
            return result;
        }

        this.symbol.exports.forEach(symbol => {
            const astSymbol = new AstSymbol(this.options, symbol, { parentId: this.id });

            if (!this.options.itemsRegistry.hasItem(symbol)) {
                options.addAstItemToRegistry(astSymbol);
            }

            result.members.push({ id: astSymbol.id });
        });

        return result;
    }
}
