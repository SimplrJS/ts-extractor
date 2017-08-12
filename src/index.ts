import * as path from "path";
import { ParseConfig, RawTsExtractorConfig } from "./contracts/config";
import { ReadPackageJson } from "./utils/package.json";
import { GetCompilerOptions } from "./utils/tsconfig.json";

const config = ParseConfig({
    projectPath: "examples/simple"
} as RawTsExtractorConfig);

async function main(): Promise<void> {
    const packageJson = await ReadPackageJson(config.packageJsonPath);
    const compilerOptions = await GetCompilerOptions(config.tsConfigPath);

    console.info(packageJson);
    console.info(compilerOptions);
}

main();
