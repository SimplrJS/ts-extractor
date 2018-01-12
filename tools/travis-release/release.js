"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const simplr_logger_1 = require("simplr-logger");
const logger = new simplr_logger_1.LoggerBuilder();
function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        const travisTag = process.env["TRAVIS_TAG"];
        logger.Info("---- Travis-Release ----");
        logger.Info("TravisTag", travisTag);
        if (travisTag == null) {
            return undefined;
        }
        const packageJsonPath = path.join(process.cwd(), "./package.json");
        const packageJsonContents = yield fs.readJson(packageJsonPath);
        const prereleaseTags = ["-alpha", "-beta", "-rc"];
        let isPrerelease = false;
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
        yield fs.writeJson(packageJsonPath, packageJsonContents, { spaces: 4 });
    });
}
Main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVsZWFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlbGVhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0IsaURBQThDO0FBRTlDLE1BQU0sTUFBTSxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO0FBV25DOztRQUNJLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXBDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUVELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDbkUsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFnQixDQUFDO1FBRTlFLE1BQU0sY0FBYyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVsRCxJQUFJLFlBQVksR0FBWSxLQUFLLENBQUM7UUFDbEMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDcEIsS0FBSyxDQUFDO1lBQ1YsQ0FBQztRQUNMLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBRUQsY0FBYztRQUNkLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVDLG1CQUFtQixDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDM0MsQ0FBQztRQUVELGVBQWU7UUFDZixtQkFBbUIsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUMvQyxNQUFNLEVBQUUsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLG1CQUFtQixFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztDQUFBO0FBRUQsSUFBSSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnMtZXh0cmFcIjtcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBMb2dnZXJCdWlsZGVyIH0gZnJvbSBcInNpbXBsci1sb2dnZXJcIjtcclxuXHJcbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXJCdWlsZGVyKCk7XHJcblxyXG5pbnRlcmZhY2UgUGFja2FnZUpzb24ge1xyXG4gICAgdmVyc2lvbjogc3RyaW5nO1xyXG4gICAgcHVibGlzaENvbmZpZz86IHtcclxuICAgICAgICB0YWc/OiBzdHJpbmc7XHJcbiAgICAgICAgcmVnaXN0cnk/OiBzdHJpbmc7XHJcbiAgICAgICAgYWNjZXNzPzogc3RyaW5nO1xyXG4gICAgfTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gTWFpbigpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IHRyYXZpc1RhZyA9IHByb2Nlc3MuZW52W1wiVFJBVklTX1RBR1wiXTtcclxuICAgIGxvZ2dlci5JbmZvKFwiLS0tLSBUcmF2aXMtUmVsZWFzZSAtLS0tXCIpO1xyXG4gICAgbG9nZ2VyLkluZm8oXCJUcmF2aXNUYWdcIiwgdHJhdmlzVGFnKTtcclxuXHJcbiAgICBpZiAodHJhdmlzVGFnID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhY2thZ2VKc29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcIi4vcGFja2FnZS5qc29uXCIpO1xyXG4gICAgY29uc3QgcGFja2FnZUpzb25Db250ZW50cyA9IGF3YWl0IGZzLnJlYWRKc29uKHBhY2thZ2VKc29uUGF0aCkgYXMgUGFja2FnZUpzb247XHJcblxyXG4gICAgY29uc3QgcHJlcmVsZWFzZVRhZ3MgPSBbXCItYWxwaGFcIiwgXCItYmV0YVwiLCBcIi1yY1wiXTtcclxuXHJcbiAgICBsZXQgaXNQcmVyZWxlYXNlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBwcmVyZWxlYXNlVGFncykge1xyXG4gICAgICAgIGlmIChwYWNrYWdlSnNvbkNvbnRlbnRzLnZlcnNpb24uaW5kZXhPZih0YWcpKSB7XHJcbiAgICAgICAgICAgIGlzUHJlcmVsZWFzZSA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWlzUHJlcmVsZWFzZSkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJlLXJlbGVhc2VcclxuICAgIGlmIChwYWNrYWdlSnNvbkNvbnRlbnRzLnB1Ymxpc2hDb25maWcgPT0gbnVsbCkge1xyXG4gICAgICAgIHBhY2thZ2VKc29uQ29udGVudHMucHVibGlzaENvbmZpZyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCB0YWcgbmV4dFxyXG4gICAgcGFja2FnZUpzb25Db250ZW50cy5wdWJsaXNoQ29uZmlnLnRhZyA9IFwibmV4dFwiO1xyXG4gICAgYXdhaXQgZnMud3JpdGVKc29uKHBhY2thZ2VKc29uUGF0aCwgcGFja2FnZUpzb25Db250ZW50cywgeyBzcGFjZXM6IDQgfSk7XHJcbn1cclxuXHJcbk1haW4oKTtcclxuIl19