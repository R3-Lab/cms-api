import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts", "src/react/index.ts", "src/types/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    target: "es2018",
});
