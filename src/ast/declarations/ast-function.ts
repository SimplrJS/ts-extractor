import * as ts from "typescript";
import { AstItemKind, GatheredMemberReference } from "../../contracts/ast-item";
import { AstCallableBase, AstCallableGatheredResult, AstCallableBaseDto } from "../ast-callable-base";

export interface AstFunctionDto extends AstCallableBaseDto {
    kind: AstItemKind.Function;
}

export class AstFunction extends AstCallableBase<ts.FunctionDeclaration, AstCallableGatheredResult, AstFunctionDto> {
    public readonly itemKind: AstItemKind.Function = AstItemKind.Function;

    protected onExtract(): AstFunctionDto {
        const typeParameters = this.gatheredMembers.typeParameters.map<GatheredMemberReference>(x => ({ id: x.item.id, alias: x.alias }));
        const parameters = this.gatheredMembers.parameters.map<GatheredMemberReference>(x => ({ id: x.item.id, alias: x.alias }));
        let returnType: GatheredMemberReference | undefined;
        if (this.gatheredMembers.returnType != null) {
            returnType = {
                id: this.gatheredMembers.returnType.item.id
            };
        }

        return {
            kind: this.itemKind,
            name: this.name,
            typeParameters: typeParameters,
            parameters: parameters,
            returnType: returnType,
            isOverloadBase: this.isOverloadBase
        };
    }

    protected getDefaultGatheredMembers(): AstCallableGatheredResult {
        return {
            typeParameters: [],
            parameters: []
        };
    }
}
