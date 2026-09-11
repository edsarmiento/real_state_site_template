import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const script = fileURLToPath(new URL("./smoke-dark-visual.mjs", import.meta.url));

for (const stage of ["launch", "newPage"]) {
  test(`smoke writes a failure report when ${stage} rejects`, () => {
    const directory = mkdtempSync(path.join(tmpdir(), "dark-smoke-test-"));
    try {
      // Inject browser startup failures without launching Chrome or calling an API.
      const stub = `
        import { writeFileSync } from 'node:fs';
        export default {
          async launch() {
            if (${JSON.stringify(stage)} === 'launch') throw new Error('launch failed');
            return {
              async newPage() { throw new Error('newPage failed'); },
              async close() { writeFileSync('browser-closed', 'yes'); }
            };
          }
        };
      `;
      const loader = path.join(directory, "mock-browser.mjs");
      writeFileSync(loader, `
        import { registerHooks } from 'node:module';
        registerHooks({
          resolve(specifier, context, nextResolve) {
            if (specifier === 'puppeteer-core') return {
              url: ${JSON.stringify(`data:text/javascript,${encodeURIComponent(stub)}`)},
              shortCircuit: true
            };
            return nextResolve(specifier, context);
          }
        });
      `);
      const result = spawnSync(process.execPath, ["--import", loader, script], {
        cwd: directory,
        encoding: "utf8",
        timeout: 10000,
      });
      assert.ifError(result.error);
      assert.equal(result.status, 1, result.stderr);
      const report = JSON.parse(readFileSync(path.join(directory, "docs/audits/smoke-dark/results.json"), "utf8"));
      assert.equal(report.summary.fail, 1);
      assert.deepEqual(report.findings, [{ id: "smoke-error", status: "FAIL", detail: `Error: ${stage} failed` }]);
      assert.equal(existsSync(path.join(directory, "browser-closed")), stage === "newPage");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
