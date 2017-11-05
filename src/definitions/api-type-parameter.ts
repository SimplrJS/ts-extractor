import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

import { ApiTypeParameterDto } from "../contracts/definitions/api-type-parameter-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";

export class ApiTypeParameter extends ApiItem<ts.TypeParameterDeclaration, ApiTypeParameterDto> {
    protected GetConstraintType(): TypeDto | undefined {
        if (this.Declaration.constraint == null) {
            return;
        }

        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.constraint);
        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    protected GetDefaultType(): TypeDto | undefined {
        if (this.Declaration.default == null) {
            return;
        }

        const type = this.TypeChecker.getTypeFromTypeNode(this.Declaration.default);
        return ApiHelpers.TypeToApiTypeDto(type, this.Options);
    }

    public Extract(): ApiTypeParameterDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const contraintType: TypeDto | undefined = this.GetConstraintType();
        const defaultType: TypeDto | undefined = this.GetDefaultType();

        return {
            ApiKind: ApiItemKinds.Type,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            ContraintType: contraintType,
            DefaultType: defaultType
        };
    }
}
