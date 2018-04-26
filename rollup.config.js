import typescript from "rollup-plugin-typescript2";
import uglify from "rollup-plugin-uglify";
import autoExternal from "rollup-plugin-auto-external";

// `npm run build` -> `ROLLUP_WATCH` is false
// `npm run watch` -> `ROLLUP_WATCH` is true
const production = !process.env.ROLLUP_WATCH;

let plugins;
if (production) {
    plugins = [
        uglify()
    ];
} else {
    plugins = [];
}

export default {
    input: "./src/index.ts",
    output: {
        file: "./dist/ts-extractor.js",
        format: "cjs",
        name: "ts-extractor"
    },
    plugins: [
        typescript(),
        autoExternal(),
        ...plugins
    ]
}
