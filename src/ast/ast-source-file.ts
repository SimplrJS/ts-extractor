import * as ts from "typescript";

import { AstItemBase } from "../abstractions/api-item-base";
import { AstItemBaseDto, AstItemMemberReference, AstItemKind } from "../contracts/ast-item";

// tslint:disable-next-line no-empty-interface
export interface AstSourceFileDto extends AstItemBaseDto {}

export class AstSourceFile extends AstItemBase<AstSourceFileDto, ts.SourceFile> {
    public get itemKind(): AstItemKind {
        return AstItemKind.SourceFile;
    }

    public get itemId(): string {
        return `${this.parentId}.${this.name}`;
    }

    public get name(): string {
        return this.item.fileName;
    }

    protected onExtract(): AstSourceFileDto {
        return {
            name: this.name
        };
    }

    protected onGatherMembers(): AstItemMemberReference[] {
        return [];
    }
}
