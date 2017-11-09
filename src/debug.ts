import * as path from "path";
import { ParseConfig, RawTsExtractorConfig } from "./contracts/config";
import { ReadPackageJson } from "./utils/package-json";
import { GetCompilerOptions } from "./utils/tsconfig-json";

import { Extractor } from "./extractor";

const config = ParseConfig({
    projectPath: "examples/simple"
} as RawTsExtractorConfig);

async function main(): Promise<void> {
    const packageJson = await ReadPackageJson(config.packageJsonPath);
    const compilerOptions = await GetCompilerOptions(config.tsConfigPath);

    // console.info(packageJson);
    // console.info(compilerOptions);

    const extractor = new Extractor({
        CompilerOptions: compilerOptions,
        ProjectDirectory: path.resolve(__dirname, "../examples/simple/"),
        Exclude: []
    });

    const extract1 = extractor.Extract([path.resolve("examples/simple/index.ts")]);
    // const extract2 = extractor.Extract([path.resolve("examples/simple/exported-functions.ts")]);
    console.log(JSON.stringify(extract1, null, 4));
}

main();
