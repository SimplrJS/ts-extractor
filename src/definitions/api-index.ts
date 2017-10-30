import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiIndexDto } from "../contracts/definitions/api-index-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

import { ApiParameter } from "./api-parameter";

export class ApiIndex extends ApiItem<ts.IndexSignatureDeclaration, ApiIndexDto> {
    constructor(declaration: ts.IndexSignatureDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Parameter
        const parameters = ApiHelpers.GetItemsFromDeclarationsIds(declaration.parameters, this.Options);
        Object.keys(parameters).forEach(key => {
            const value = parameters[key];

            if (!Array.isArray(value)) {
                this.parameter = value;
            }

            return false;
        });
    }

    private parameter: string;

    private getType(): TypeDto {
        if (this.Declaration.type == null) {
            throw new Error("IndexSignature must have type.");
        }
        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type);
        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiIndexDto {
        return {
            ApiKind: ApiItemKinds.Index,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Parameter: this.parameter,
            Type: this.getType()
        };
    }
}
