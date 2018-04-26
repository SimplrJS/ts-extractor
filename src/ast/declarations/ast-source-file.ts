import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";
import * as path from "path";

import {
    GatheredMemberMetadata,
    AstItemKind,
    GatheredMembersResult,
    AstItemOptions,
    AstItemGatherMembersOptions
} from "../../contracts/ast-item";
import { Helpers } from "../../utils/helpers";
import { AstDeclarationBase } from "../ast-declaration-base";
import { AstSymbol } from "../ast-symbol";
import { AstDeclarationIdentifiers } from "../../contracts/ast-declaration";
import { ExtractorHelpers } from "../../extractor-helpers";

export interface AstSourceFileIdentifiers extends AstDeclarationIdentifiers {
    packageName?: string;
}

export interface AstSourceFileGatheredResult extends GatheredMembersResult {
    members: Array<GatheredMemberMetadata<AstSymbol>>;
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
            members: this.getMembersFromSymbolList(options, this.symbol.exports)
        };

        if (result.members.length === 0) {
            ExtractorHelpers.logWithNodePosition(this.item, "No exported members were found in source file.", x => this.logger.Warn(x));
        }

        return result;
    }
}
