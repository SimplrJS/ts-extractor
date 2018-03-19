import * as ts from "typescript";

import { AstItemBase } from "../abstractions/api-item-base";
import { AstItemBaseDto, AstItemMemberReference } from "../contracts/ast-item";

// tslint:disable-next-line no-empty-interface
export interface AstSourceFileDto extends AstItemBaseDto {}

export class AstSourceFile extends AstItemBase<AstSourceFileDto, ts.SourceFile> {
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
