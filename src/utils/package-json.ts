import * as readPackageJson from "read-package-json";
import { PackageJson } from "read-package-json";
import { LogLevel } from "simplr-logger";

import { Logger } from "./logger";

export function ErrorReporter(...messages: string[]): void {
    Logger.Log(LogLevel.Error, messages.join(" "));
}

export async function ReadPackageJson(
    packageJsonPath: string,
    errorReporter: Function = ErrorReporter,
    strict: boolean = false
): Promise<PackageJson> {
    return new Promise<PackageJson>((resolve, reject) => {
        readPackageJson(packageJsonPath, errorReporter, strict, (err: Error, data: PackageJson) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}
