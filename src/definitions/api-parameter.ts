import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
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

    protected OnGatherData(): void {
        // Type
        const type = this.TypeChecker.getTypeOfSymbolAtLocation(this.Symbol, this.Declaration);
        this.type = ApiHelpers.TypeToApiTypeDto(type, this.Options);

        // IsOptional
        this.isOptional = Boolean(this.Declaration.questionToken);

        // IsSpread
        this.isSpread = Boolean(this.Declaration.dotDotDotToken);
    }

    public OnExtract(): ApiParameterDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = this.GetDeclarationLocation();

        return {
            ApiKind: ApiItemKinds.Parameter,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            IsOptional: this.isOptional,
            IsSpread: this.isSpread,
            Type: this.type
        };
    }
}
