import * as path from "path";

export namespace Helpers {
    export function removeExt(location: string): string {
        const extension = path.extname(location);
        return location.substring(0, location.length - extension.length);
    }
}
