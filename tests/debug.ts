import * as path from "path";
import { getCompilerOptions } from "../src/utils/tsconfig-json";
import { readPackageJson } from "../src/utils/package-json";

import { TsExtractor } from "../src/extractor";
import { LogLevel } from "simplr-logger";

export async function main(): Promise<void> {
    const projectDirectory = path.resolve(__dirname, "./examples/simple/");
    const tsconfigPath = path.join(projectDirectory, "tsconfig.json");
    const packageJsonPath = path.join(projectDirectory, "package.json");
    const compilerOptions = await getCompilerOptions(tsconfigPath);
    const packageJson = await readPackageJson(packageJsonPath);

    const extractor = new TsExtractor({
        compilerOptions: compilerOptions,
        packageJson: packageJson,
        projectDirectory: projectDirectory,
        logLevel: LogLevel.Debug
    });

    console.log(extractor.extractToJson([path.resolve("examples/simple/index.ts")]));
    debugger;
}

main();

// import * as path from "path";
// import { GetCompilerOptions } from "./utils/tsconfig-json";
// import * as fs from "fs-extra";

// import { Extractor } from "./extractor";
// import { ApiHelpers } from "./api-helpers";
// import { AccessModifier } from "./contracts";

// async function main(): Promise<void> {
//     const projectDirectory = path.resolve(__dirname, "./examples/simple/");
//     const tsconfigPath = path.join(projectDirectory, "tsconfig.json");
//     const compilerOptions = await GetCompilerOptions(tsconfigPath);

//     const extractor = new Extractor({
//         CompilerOptions: compilerOptions,
//         ProjectDirectory: projectDirectory,
//         ExternalPackages: ["typescript"],
//         FilterApiItems: apiItem => {
//             const accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(apiItem.Declaration.modifiers);
//             if (accessModifier === AccessModifier.Private) {
//                 return false;
//             }

//             const metadata = apiItem.GetItemMetadata();
//             if (metadata.JSDocTags.findIndex(x => x.name === "private") !== -1) {
//                 return false;
//             }

//             return true;
//         }
//     });

//     const extract1 = extractor.Extract([path.resolve("examples/simple/index.ts")]);
//     // tslint:disable-next-line:no-console
//     console.log(JSON.stringify(extract1, null, 4));

//     await fs.writeJson("./debug.json", extract1);
// }

// main();
