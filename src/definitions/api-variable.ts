import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiVariableDto } from "../contracts/definitions/api-variable-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiVariable extends ApiItem<ts.VariableDeclaration, ApiVariableDto> {
    constructor(declaration: ts.VariableDeclaration, symbol: ts.Symbol, options: ApiItemOptions) {
        super(declaration, symbol, options);

        // Type
        if (this.Declaration.type != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.type);
            this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);
        }
    }

    private type: TypeDto | undefined;

    public Extract(): ApiVariableDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Variable,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Type: this.type
        };
    }
}
