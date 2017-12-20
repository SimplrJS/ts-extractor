import * as path from "path";
import { GetCompilerOptions } from "./utils/tsconfig-json";

import { Extractor } from "./extractor";

async function main(): Promise<void> {
    const projectDirectory = path.resolve(__dirname, "../examples/simple/");
    const tsconfigPath = path.join(projectDirectory, "tsconfig.json");
    const compilerOptions = await GetCompilerOptions(tsconfigPath);

    const extractor = new Extractor({
        CompilerOptions: compilerOptions,
        ProjectDirectory: projectDirectory,
        ExternalPackages: ["typescript"]
    });

    const extract1 = extractor.Extract([path.resolve("examples/simple/index.ts")]);
    // tslint:disable-next-line:no-console
    console.log(JSON.stringify(extract1, null, 4));
}

main();
