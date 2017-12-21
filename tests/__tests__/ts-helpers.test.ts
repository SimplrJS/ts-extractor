import { TSHelpers } from "@src/ts-helpers";

describe("IsTypeScriptInternalSymbolName", () => {
    it("Internal names", () => {
        const internalNames = ["__type", "__call"];

        internalNames.forEach(x =>
            expect(TSHelpers.IsInternalSymbolName(x)).toBe(true)
        );
    });

    it("Internal names", () => {
        const internalNames = ["Foo", "Bar"];

        internalNames.forEach(x =>
            expect(TSHelpers.IsInternalSymbolName(x)).toBe(false)
        );
    });
});
