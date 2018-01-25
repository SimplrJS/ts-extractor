import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiVariableDto, ApiVariableDeclarationType } from "../contracts/definitions/api-variable-dto";
import { ApiItemKind } from "../contracts/api-item-kind";
import { ApiType } from "../contracts/api-type";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiVariable extends ApiItem<ts.VariableDeclaration, ApiVariableDto> {
    private location: ApiItemLocationDto;
    private type: ApiType;
    private variableDeclarationType: ApiVariableDeclarationType;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, this.location, type, this.Declaration.type);

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
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKind.Variable,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            VariableDeclarationType: this.variableDeclarationType,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
