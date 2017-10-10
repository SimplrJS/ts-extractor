import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";
import { ApiParameter } from "./api-parameter";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiFunctionDto } from "../contracts/definitions/api-function-dto";
import { ApiItemReferenceDict } from "../contracts/api-item-reference-dict";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";

export class ApiFunction extends ApiItem<ts.FunctionDeclaration, ApiFunctionDto> {
    constructor(declaration: ts.FunctionDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Parameters
        this.parameters = ApiHelpers.GetItemsFromDeclarationsIds(declaration.parameters, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program,
            ProjectDirectory: this.ProjectDirectory
        });
    }

    private parameters: ApiItemReferenceDict = {};

    public GetReturnType(): TypeDto {
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);

        return ApiHelpers.TypeToApiTypeDto(type, {
            ItemsRegistry: this.ItemsRegistry,
            Program: this.Program,
            ProjectDirectory: this.ProjectDirectory
        });
    }

    public Extract(): ApiFunctionDto {
        return {
            ApiKind: ApiItemKinds.Function,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Parameters: this.parameters,
            ReturnType: this.GetReturnType()
        };
    }
}
