import * as path from "path";
// TODO: Fix paths.
import { GetCompilerOptions } from "../../../src/utils/tsconfig-json";

it("Successfully get compiler options", async done => {
    try {
        const compilerOptions = await GetCompilerOptions(path.resolve(__dirname, "./_tsconfig.json"));
        expect(compilerOptions).toMatchSnapshot();
        done();
    } catch (err) {
        done.fail(err);
    }
});
