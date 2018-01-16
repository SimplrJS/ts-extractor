import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiParameterDto } from "../contracts/definitions/api-parameter-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiType } from "../contracts/api-type";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";
import { ApiTypeHelpers } from "../api-type-helpers";

export class ApiParameter extends ApiItem<ts.ParameterDeclaration, ApiParameterDto> {
    private type: ApiType;
    private isOptional: boolean;
    private isSpread: boolean;
    private initializer: string | undefined;

    protected OnGatherData(): void {
        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiTypeHelpers.ResolveApiType(this.Options, type, this.Declaration.type);

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);

        // IsSpread
        this.isSpread = Boolean(this.Declaration.dotDotDotToken);

        // Initializer
        this.initializer = this.Declaration.initializer != null ? this.Declaration.initializer.getText() : undefined;
    }

    public OnExtract(): ApiParameterDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Parameter,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: location,
            IsOptional: this.isOptional,
            IsSpread: this.isSpread,
            Initializer: this.initializer,
            Type: this.type,
            _ts: this.GetTsDebugInfo()
        };
    }
}
