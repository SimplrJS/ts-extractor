import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiType } from "../contracts/api-type";
import { ApiCallableDto } from "../contracts/api-callable-dto";
import { ApiTypeHelpers } from "../api-type-helpers";
import { ApiItemLocationDto } from "../contracts";

/**
 * A callable api item base.
 */
export abstract class ApiCallableBase<
    TDeclaration extends ts.SignatureDeclaration,
    TExtractDto extends ApiCallableDto
    >
    extends ApiItem<TDeclaration, TExtractDto> {

    protected IsOverloadBase: boolean;
    protected Parameters: ApiItemReference[] = [];
    protected TypeParameters: ApiItemReference[] = [];
    protected ReturnType: ApiType | undefined;
    protected Location: ApiItemLocationDto;

    protected OnGatherData(): void {
        // ApiItemLocation
        this.Location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);

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

            this.ReturnType = ApiTypeHelpers.ResolveApiType(this.Options, this.Location, type, this.Declaration.type);
        }
    }
}
