import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeParameterDto } from "../contracts/definitions/api-type-parameter-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiTypeParameter extends ApiItem<ts.TypeParameterDeclaration, ApiTypeParameterDto> {
    private constraintType: TypeDto | undefined;
    private defaultType: TypeDto | undefined;

    protected OnGatherData(): void {
        // Constraint type
        if (this.Declaration.constraint != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.constraint);
            this.constraintType = ApiHelpers.TypeToApiTypeDto(type, this.Options);
        }

        // Default type
        if (this.Declaration.default != null) {
            const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.default);
            this.defaultType = ApiHelpers.TypeToApiTypeDto(type, this.Options);
        }
    }

    public OnExtract(): ApiTypeParameterDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();

        return {
            ApiKind: ApiItemKinds.Type,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            ConstraintType: this.constraintType,
            DefaultType: this.defaultType
        };
    }
}
