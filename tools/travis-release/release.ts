import * as fs from "fs-extra";
import * as path from "path";
import { LoggerBuilder } from "simplr-logger";

const logger = new LoggerBuilder();

interface PackageJson {
    version: string;
    publishConfig?: {
        tag?: string;
        registry?: string;
        access?: string;
    };
}

async function Main(): Promise<void> {
    const travisTag = process.env["TRAVIS_TAG"];
    logger.Info("---- Travis-Release ----");
    logger.Info("TravisTag", travisTag);

    if (travisTag == null) {
        return undefined;
    }

    const packageJsonPath = path.join(process.cwd(), "./package.json");
    const packageJsonContents = await fs.readJson(packageJsonPath) as PackageJson;

    const prereleaseTags = ["-alpha", "-beta", "-rc"];

    let isPrerelease: boolean = false;
    for (const tag of prereleaseTags) {
        if (packageJsonContents.version.indexOf(tag)) {
            isPrerelease = true;
            break;
        }
    }

    if (!isPrerelease) {
        return undefined;
    }

    // Pre-release
    if (packageJsonContents.publishConfig == null) {
        packageJsonContents.publishConfig = {};
    }

    // Add tag next
    packageJsonContents.publishConfig.tag = "next";
    await fs.writeJson(packageJsonPath, packageJsonContents, { spaces: 4 });
}

Main();
