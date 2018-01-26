import * as ts from "typescript";
import { ApiItem } from "../abstractions/api-item";

import { ApiHelpers } from "../api-helpers";
import { ApiDefinitionKind, ApiEnumMemberDto } from "../contracts/api-definitions";
import { ApiMetadataDto } from "../contracts/api-metadata-dto";
import { ApiItemLocationDto } from "../contracts/api-item-location-dto";

export class ApiEnumMember extends ApiItem<ts.EnumMember, ApiEnumMemberDto> {
    private location: ApiItemLocationDto;

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
        // ApiItemLocation
        this.location = ApiHelpers.GetApiItemLocationDtoFromNode(this.Declaration, this.Options);
    }

    public OnExtract(): ApiEnumMemberDto {
        const parentId: string | undefined = ApiHelpers.GetParentIdFromDeclaration(this.Declaration, this.Options);
        const metadata: ApiMetadataDto = this.GetItemMetadata();
        const value: string = this.GetValue();

        return {
            ApiKind: ApiDefinitionKind.EnumMember,
            Name: this.Symbol.name,
            ParentId: parentId,
            Metadata: metadata,
            Location: this.location,
            Value: value,
            _ts: this.GetTsDebugInfo()
        };
    }
}
