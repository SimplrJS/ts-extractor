import * as os from "os";
import * as process from "process";
import * as fs from "fs-extra";
import { LogLevel } from "simplr-logger";
import { Logger } from "../src/utils/logger";

import { TestsBuilder } from "./scripts/tests-builder";
import { TestsCleanup } from "./scripts/tests-cleanup";
import { TESTS_DIR_NAME } from "./scripts/tests-helpers";

async function StartWatcher(dirName: string): Promise<fs.FSWatcher> {
    return fs.watch(`./${dirName}/`, async (event, fileName) => {
        if (fileName.indexOf(TESTS_DIR_NAME) === -1) {
            Logger.Log(LogLevel.Information, `Test file was changed in "${dirName}/${fileName}".`);
            const startBuild = Logger.Log(LogLevel.Information, `Building tests for "${dirName}"...`);
            await TestsBuilder(dirName, __dirname);
            Logger.Log(LogLevel.Debug, `Builded tests after ${(Date.now() - startBuild)}ms`);
        }
    });
}

(async (dirNames: string[]) => {
    Logger.Log(LogLevel.Information, "Starting test builder...");
    for (const dirName of dirNames) {
        const startRemove = Logger.Log(LogLevel.Information, `Removing old tests from "${dirName}"...`);
        await TestsCleanup(dirName);
        Logger.Log(LogLevel.Debug, `Removed old tests after ${(Date.now() - startRemove)}ms`);

        const startBuild = Logger.Log(LogLevel.Information, `Building tests for "${dirName}"...`);
        await TestsBuilder(dirName, __dirname);
        Logger.Log(LogLevel.Debug, `Builded tests after ${(Date.now() - startBuild)}ms`);

        if (process.argv.indexOf("--watchAll") !== -1) {
            Logger.Log(LogLevel.Information, `Started watching "${dirName}" tests.`);
            StartWatcher(dirName);
        }
    }
})(["cases"]);
