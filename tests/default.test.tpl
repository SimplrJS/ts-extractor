import { TsExtractor, getCompilerOptions } from "@src/index";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";
    const { EntryFiles, ...rest }: any = {{{json testConfig}}};
    const compilerOptions = await getCompilerOptions("./tsconfig.json");

    try {
        const extractor = new TsExtractor({
            projectDirectory: projectDirectory,
            compilerOptions: compilerOptions
        });
        expect(extractor.extractToJson(EntryFiles)).toMatchSnapshot();
        done();
    } catch (error) {
        done.fail(error);
    }
});
