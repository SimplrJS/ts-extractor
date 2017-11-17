import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiFunctionDto } from "../contracts/definitions/api-function-dto";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { TypeDto } from "../contracts/type-dto";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiCallableDto } from "../contracts/api-callable-dto";

/**
 * A callable api item base.
 */
export abstract class ApiCallableBase<
    TDeclaration extends ts.SignatureDeclaration,
    TExtractDto extends ApiCallableDto
    >
    extends ApiItem<TDeclaration, TExtractDto> {

    protected Parameters: ApiItemReferenceTuple = [];
    protected TypeParameters: ApiItemReferenceTuple = [];
    protected ReturnType: TypeDto | undefined;

    protected OnGatherData(): void {
        // Parameters
        this.Parameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.parameters, this.Options);

        // TypeParameters
        if (this.Declaration.typeParameters != null) {
            this.TypeParameters = ApiHelpers.GetItemsIdsFromDeclarations(this.Declaration.typeParameters, this.Options);
        }

        // ReturnType
        const signature = this.TypeChecker.getSignatureFromDeclaration(this.Declaration);
        if (signature != null) {
            const type = this.TypeChecker.getReturnTypeOfSignature(signature);

            this.ReturnType = ApiHelpers.TypeToApiTypeDto(type, this.Options);
        }
    }
}
