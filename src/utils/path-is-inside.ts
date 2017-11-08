import * as path from "path";

export function PathIsInside(thePath: string, potentialParent: string): boolean {
    // For inside-directory checking, we want to allow trailing slashes, so normalize.
    thePath = StripTrailingSep(thePath);
    potentialParent = StripTrailingSep(potentialParent);

    // Node treats only Windows as case-insensitive in its path module; we follow those conventions.
    if (process.platform === "win32") {
        thePath = thePath.toLowerCase();
        potentialParent = potentialParent.toLowerCase();
    }

    thePath = path.normalize(thePath);
    potentialParent = path.normalize(potentialParent);

    return thePath.lastIndexOf(potentialParent, 0) === 0 &&
        (
            thePath[potentialParent.length] === path.sep ||
            thePath[potentialParent.length] === undefined
        );
}

function StripTrailingSep(thePath: string): string {
    if (thePath[thePath.length - 1] === path.sep) {
        return thePath.slice(0, -1);
    }
    return thePath;
}