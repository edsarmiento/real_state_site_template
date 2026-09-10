import assert from "node:assert/strict";
import { test } from "node:test";

import { orangeHeroTitleParts } from "./orange-hero-title.ts";

test("splits on the configured accent", () => {
  assert.deepEqual(
    orangeHeroTitleParts("Elevando el estándar de los bienes raíces.", "bienes raíces"),
    { before: "Elevando el estándar de los ", accent: "bienes raíces", after: "." },
  );
});

test("matches the accent case-insensitively", () => {
  const parts = orangeHeroTitleParts("Bienes Raíces con criterio", "bienes raíces");
  assert.equal(parts.before, "");
  assert.equal(parts.accent, "Bienes Raíces");
  assert.equal(parts.after, " con criterio");
});

test("falls back to the last two words when the accent is absent", () => {
  assert.deepEqual(
    orangeHeroTitleParts("Encuentra tu próximo inmueble", "bienes raíces"),
    { before: "Encuentra tu ", accent: "próximo inmueble", after: "" },
  );
});

test("falls back to the last word on two-word titles", () => {
  assert.deepEqual(orangeHeroTitleParts("Casas disponibles", ""), {
    before: "Casas ",
    accent: "disponibles",
    after: "",
  });
});

test("leaves single-word titles without an accent", () => {
  assert.deepEqual(orangeHeroTitleParts("Inmuebles", ""), {
    before: "Inmuebles",
    accent: "",
    after: "",
  });
});
