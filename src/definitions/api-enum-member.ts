import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";
import { ApiEnumMemberDto } from "../contracts/definitions/api-enum-member-dto";
import { ApiItemKinds } from "../contracts/api-item-kinds";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiEnumMember extends ApiItem<ts.EnumMember, ApiEnumMemberDto> {

    public GetValue(): string {
        for (const item of this.Declaration.getChildren()) {
            if (ts.isNumericLiteral(item) ||
                ts.isStringLiteral(item) ||
                ts.isBinaryExpression(item)) {
                return item.getText();
            }
        }

        let valueIndex: string | undefined;
        if (this.Declaration.parent != null) {
            const parentChildren = this.Declaration.parent.members;
            for (const index in parentChildren) {
                if (parentChildren.hasOwnProperty(index) &&
                    parentChildren[index] === this.Declaration) {
                    valueIndex = index;
                }
            }
        }

        return valueIndex || "";
    }

    protected OnGatherData(): void {
        // No gathering is needed
    }

    public OnExtract(): ApiEnumMemberDto {
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const location: ApiItemLocationDto = ApiHelpers.GetApiItemLocationDtoFromDeclaration(this.Declaration, this.Options);
        const value: string = this.GetValue();

        return {
            ApiKind: ApiItemKinds.EnumMember,
            Name: this.Symbol.name,
            Kind: this.Declaration.kind,
            KindString: ts.SyntaxKind[this.Declaration.kind],
            Metadata: metadata,
            Location: location,
            Value: value
        };
    }
}
