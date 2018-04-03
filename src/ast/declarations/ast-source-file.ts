import * as ts from "typescript";
import * as path from "path";

import { AstDeclarationBase } from "../ast-declaration-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../../contracts/ast-item";
import { AstSymbol } from "../ast-symbol";
import { TsHelpers } from "../../ts-helpers";
import { AstItemGatherMembersOptions } from "../../abstractions/ast-item-base";

// tslint:disable-next-line no-empty-interface
export interface AstSourceFileDto extends AstItemBaseDto {}

export class AstSourceFile extends AstDeclarationBase<AstSourceFileDto, ts.SourceFile> {
    public get itemKind(): AstItemKind {
        return AstItemKind.SourceFile;
    }

    public get itemId(): string {
        return `${this.parentId}/${this.name}`;
    }

    public get name(): string {
        return path.relative(this.options.projectDirectory, this.item.fileName);
    }

    public getMembers(): AstSymbol[] {
        if (this.membersReferences == null) {
            return [];
        }

        return this.membersReferences.map(x => this.options.itemsRegistry.get(x.id)) as AstSymbol[];
    }

    protected onExtract(): AstSourceFileDto {
        return {
            name: this.name
        };
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
            const astSymbol = new AstSymbol(
                {
                    ...this.options,
                    parentId: this.itemId
                },
                symbol
            );

            if (!this.options.itemsRegistry.has(astSymbol.itemId)) {
                options.addItemToRegistry(astSymbol);
            }
            membersReferences.push({ alias: astSymbol.name, id: astSymbol.itemId });
        });

        return membersReferences;
    }
}
