import * as ts from "typescript";
import { ApiItem, ApiItemOptions } from "../abstractions/api-item";

import { TSHelpers } from "../ts-helpers";
import { ApiHelpers } from "../api-helpers";

export class ApiEnumMember extends ApiItem<ts.EnumMember> {
    public GetValue(): string {
        const firstToken: ts.Node | undefined = this.Declaration ? this.Declaration.getFirstToken() : undefined;
        const lastToken: ts.Node | undefined = this.Declaration ? this.Declaration.getLastToken() : undefined;
        const declaration: ts.EnumMember = this.Declaration as ts.EnumMember;
        /**
         * TODO: Find a way to get value from this enum:
         * ```tsx
         * export enum ListOfItems {
         *     First,
         *     Second,
         *     Third
         * }
         * ```
         */
        if (lastToken == null || lastToken === firstToken) {
            return "";
        }

        return lastToken.getText();
    }

    public Extract(): { [key: string]: any; } {
        return {
            Kind: "enum-member",
            Name: this.Symbol.name,
            Value: this.GetValue()
        };
    }
}
