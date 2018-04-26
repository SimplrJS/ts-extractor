import * as ts from "typescript";
import { LazyGetter } from "typescript-lazy-get-decorator";

import { AstItemBase } from "../abstractions/ast-item-base";
import {
    AstItemKind,
    GatheredMembersResult,
    AstItemOptions,
    AstItemGatherMembersOptions,
    GatheredMemberMetadata
} from "../contracts/ast-item";
import { TsHelpers } from "../ts-helpers";
import { ExtractorHelpers } from "../extractor-helpers";
import { AstItem } from "../contracts/ast-item";
import { AstDeclaration } from "./ast-declaration-base";

export interface AstSymbolGatheredResult extends GatheredMembersResult {
    members: Array<GatheredMemberMetadata<AstDeclaration>>;
}

export interface AstSymbolIdentifiers {
    parentId?: string;
}

export class AstSymbol extends AstItemBase<ts.Symbol, AstSymbolGatheredResult, {}> {
    constructor(options: AstItemOptions, symbol: ts.Symbol, private readonly identifiers: AstSymbolIdentifiers = {}) {
        super(options, symbol);
    }

    public readonly itemKind: AstItemKind = AstItemKind.Symbol;

    @LazyGetter()
    public get name(): string {
        return TsHelpers.resolveSymbolName(this.item);
    }

    /**
     * Returns initialized AstDeclaration instance.
     */
    private getFirstAstDeclaration(): AstItemBase<ts.Declaration, any, any> | undefined {
        if (this.item.declarations == null || this.item.declarations.length === 0) {
            return undefined;
        }
        const declaration = this.item.declarations[0];
        return this.options.resolveAstDeclaration(declaration, this.item);
    }

    @LazyGetter()
    private get parent(): AstItem<any, any> | undefined {
        if (this.identifiers.parentId != null && this.options.itemsRegistry.hasItemById(this.identifiers.parentId)) {
            return this.options.itemsRegistry.getAstItemById(this.identifiers.parentId);
        }

        const firstAstDeclaration = this.getFirstAstDeclaration();
        if (firstAstDeclaration == null) {
            return undefined;
        }

        const parentDeclaration = firstAstDeclaration.item.parent as ts.Declaration | undefined;
        if (parentDeclaration == null) {
            return undefined;
        }

        const parentSymbol = TsHelpers.getSymbolFromDeclaration(parentDeclaration, this.typeChecker);
        if (parentSymbol == null) {
            return undefined;
        }

        return this.options.resolveAstDeclaration(parentDeclaration, parentSymbol);
    }

    @LazyGetter()
    public get parentId(): string | undefined {
        if (this.identifiers.parentId != null) {
            return this.identifiers.parentId;
        }

        if (this.parent == null) {
            return undefined;
        }

        return this.parent.id;
    }

    @LazyGetter()
    public get id(): string {
        if (this.parent == null) {
            const astDeclaration = this.getFirstAstDeclaration();
            const message = "Failed to resolve symbol's parent id.";

            if (astDeclaration == null) {
                this.logger.Error(message);
            } else {
                ExtractorHelpers.logWithNodePosition(astDeclaration.item, message, x => this.logger.Error(x));
            }

            return `???:${this.name}`;
        }

        // Separate SourceFile from other items.
        let itemSeparator: string;
        if (this.parent.itemKind === AstItemKind.SourceFile) {
            itemSeparator = ":";
        } else {
            itemSeparator = ".";
        }

        return `${this.parentId}${itemSeparator}${this.name}`;
    }

    protected onExtract(): {} {
        return {};
    }

    protected getDefaultGatheredMembers(): AstSymbolGatheredResult {
        return {
            members: []
        };
    }

    protected onGatherMembers(options: AstItemGatherMembersOptions): AstSymbolGatheredResult {
        const result: AstSymbolGatheredResult = {
            members: []
        };

        if (this.item.declarations == null) {
            this.logger.Error(`${this.id}: Symbol declarations list is undefined.`);
            return result;
        }

        let counter: number = 0;
        for (const declaration of this.item.declarations) {
            const sameKind = this.item.declarations.findIndex(x => x.kind === declaration.kind && x !== declaration) !== -1;
            const astItem = this.options.resolveAstDeclaration(declaration, this.item, { itemCounter: sameKind ? counter : undefined });

            if (!this.options.itemsRegistry.hasItem(declaration)) {
                options.addAstItemToRegistry(astItem);
            }

            result.members.push({ item: astItem });

            if (sameKind) {
                counter++;
            }
        }

        return result;
    }
}
