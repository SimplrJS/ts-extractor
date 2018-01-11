import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiParameterDto } from "../contracts/definitions/api-parameter-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiParameter extends ApiItem<ts.ParameterDeclaration, ApiParameterDto> {
    private type: TypeDto;
    private isOptional: boolean;
    private isSpread: boolean;
    private initializer: string | undefined;

    protected OnGatherData(): void {
        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);

        // IsSpread
        this.isSpread = Boolean(this.Declaration.dotDotDotToken);

        // Initializer
        this.initializer = this.Declaration.initializer != null ? this.Declaration.initializer.getText() : undefined;
    }

    public OnExtract(): ApiParameterDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

        return {
            ApiKind: ApiItemKinds.Parameter,
            Name: this.Symbol.name,
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
