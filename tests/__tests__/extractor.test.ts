import * as ts from "typescript";
import * as path from "path";
import { Extractor } from "@src/extractor";

const EXTRACTOR_COMPILER_OPTIONS: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.CommonJS,
    skipLibCheck: true,
    skipDefaultLibCheck: true
};

const EXTRACTOR_OPTIONS = {
    CompilerOptions: EXTRACTOR_COMPILER_OPTIONS,
    ProjectDirectory: path.resolve(__dirname, "../cases/"),
    ExternalPackages: []
};

it("EntryFile that doesn't exist with absolute path.", () => {
    const extractor = new Extractor(EXTRACTOR_OPTIONS);
    expect(() => extractor.Extract(["C:/does-not-exist.ts"])).toThrowError();
});

it("EntryFile that is outside of project folder.", () => {
    EXTRACTOR_OPTIONS.ProjectDirectory = __dirname;

    const extractor = new Extractor(EXTRACTOR_OPTIONS);
    expect(() => extractor.Extract(["../cases/ClassDeclaration1.ts"])).toThrowError();
});

it("EntryFile that has errors.", () => {
    EXTRACTOR_OPTIONS.ProjectDirectory = __dirname;

    const extractor = new Extractor(EXTRACTOR_OPTIONS);
    expect(() => extractor.Extract(["./file-with-errors.ts"])).toThrowError();
});
