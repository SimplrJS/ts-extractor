import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiVariableDto, ApiVariableDeclarationType } from "../contracts/definitions/api-variable-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiVariable extends ApiItem<ts.VariableDeclaration, ApiVariableDto> {
    private type: TypeDto;
    private variableDeclarationType: ApiVariableDeclarationType;

    protected OnGatherData(): void {
        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);

        // VariableDeclarationType
        if (this.Declaration.parent != null) {
            switch (this.Declaration.parent.flags) {
                case ts.NodeFlags.Const: {
                    this.variableDeclarationType = ApiVariableDeclarationType.Const;
                    break;
                }
                case ts.NodeFlags.Let: {
                    this.variableDeclarationType = ApiVariableDeclarationType.Let;
                    break;
                }
                default: {
                    this.variableDeclarationType = ApiVariableDeclarationType.Var;
                }
            }
        }
    }

    public OnExtract(): ApiVariableDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Variable,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            VariableDeclarationType: this.variableDeclarationType,
            Type: this.type
        };
    }
}
