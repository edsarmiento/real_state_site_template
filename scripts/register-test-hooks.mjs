import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

// Match the application's TypeScript alias when running Node's native TS tests.
registerHooks({
  resolve(specifier, context, nextResolve) {
    const candidate = specifier.startsWith("@/")
      ? new URL(`../src/${specifier.slice(2)}`, import.meta.url)
      : specifier.startsWith(".") && context.parentURL
        ? new URL(specifier, context.parentURL)
        : null;
    if (candidate?.protocol === "file:") {
      const filename = fileURLToPath(candidate);
      if (!existsSync(filename) && existsSync(`${filename}.ts`)) {
        return nextResolve(pathToFileURL(`${filename}.ts`).href, context);
      }
      if (specifier.startsWith("@/")) return nextResolve(candidate.href, context);
    }
    return nextResolve(specifier, context);
  },
});
