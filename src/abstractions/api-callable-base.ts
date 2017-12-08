import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiItemReferenceTuple } from "../contracts/api-item-reference-tuple";
import { TypeDto } from "../contracts/type-dto";
import { ApiCallableDto } from "../contracts/api-callable-dto";

/**
 * A callable api item base.
 */
export abstract class ApiCallableBase<
    TDeclaration extends ts.SignatureDeclaration,
    TExtractDto extends ApiCallableDto
    >
    extends ApiItem<TDeclaration, TExtractDto> {

    protected IsOverloadBase: boolean;
    protected Parameters: ApiItemReferenceTuple = [];
    protected TypeParameters: ApiItemReferenceTuple = [];
    protected ReturnType: TypeDto | undefined;

    protected OnGatherData(): void {
        // Overload
        this.IsOverloadBase = this.TypeChecker.isImplementationOfOverload(this.Declaration as ts.FunctionLike) || false;

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
