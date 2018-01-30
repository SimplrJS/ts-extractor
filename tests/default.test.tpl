import { Extractor, GetCompilerOptions } from "@src/index";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";
    const { EntryFiles, ...rest } = {{{json testConfig}}};
    const compilerOptions = await GetCompilerOptions("./tsconfig.json");

    try {
        const extractor = new Extractor({
            ProjectDirectory: projectDirectory,
            CompilerOptions: compilerOptions,
            ...rest
        });
        expect(extractor.Extract(EntryFiles)).toMatchSnapshot();
        done();
    } catch (error) {
        done.fail(error);
    }
});
