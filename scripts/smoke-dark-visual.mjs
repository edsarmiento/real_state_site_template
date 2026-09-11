import { thumbnailTarget, thumbnailIsSynced, hasVisibleInteractiveFocus } from "./smoke-dark-checks.mjs";
/**
 * Dark theme visual smoke.
 * Usage: node scripts/smoke-dark-visual.mjs
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.SMOKE_BASE || "http://localhost:3002";
const OUT = path.resolve("docs/audits/smoke-dark");
const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const VIEWPORTS = [
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 900 },
  { name: "1440", width: 1440, height: 900 },
];

fs.mkdirSync(OUT, { recursive: true });

const findings = [];
function note(id, status, detail) {
  findings.push({ id, status, detail });
  console.log(`[${status}] ${id}: ${detail}`);
}

async function shot(page, name) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

async function overflowX(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflow: doc.scrollWidth > doc.clientWidth + 1,
    };
  });
}

async function main() {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: true,
      args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
      defaultViewport: null,
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(25000);

    // —— Home / theme ——
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    const theme = await page.$eval(
      "[data-site-theme]",
      (el) => el.getAttribute("data-site-theme"),
    );
    if (theme === "dark") note("theme-attr", "PASS", 'data-site-theme="dark"');
    else note("theme-attr", "FAIL", `got ${theme}`);

    const hasOverrideMarker = await page.evaluate(() =>
      document.documentElement.innerHTML.includes('getTheme("dark")'),
    );
    note(
      "no-override-marker",
      hasOverrideMarker ? "FAIL" : "PASS",
      "no getTheme(dark) string in HTML",
    );

    await shot(page, "home-1440");

    // —— Empty results ——
    await page.goto(BASE + "/?city=__smoke_empty_city__", {
      waitUntil: "networkidle2",
    });
    const emptyText = await page.evaluate(() => document.body.innerText);
    // re-check cards
    const emptyCards = await page.$$(".dark-card");
    note(
      "empty-results",
      emptyCards.length === 0 ? "PASS" : "FAIL",
      `cards=${emptyCards.length}; snippet=${emptyText.slice(0, 120).replace(/\s+/g, " ")}`,
    );
    await shot(page, "home-empty-1440");

    // —— Locations filter ——
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    const locationHref = await page.$eval(
      ".dark-location-card, a.dark-location-card",
      (a) => a.getAttribute("href"),
    ).catch(() => null);
    if (!locationHref) {
      note("locations", "FAIL", "no location card found");
    } else {
      await page.click(".dark-location-card, a.dark-location-card");
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
      const url = page.url();
      const cityApplied = /[?&]city=/.test(url) || url.includes("city=");
      note(
        "location-filter",
        cityApplied ? "PASS" : "FAIL",
        `href=${locationHref} → ${url}`,
      );
      await shot(page, "home-location-filter-1440");
    }

    // —— Catalog viewports ——
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    for (const vp of VIEWPORTS) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
      });
      await page.waitForTimeout?.(200);
      await new Promise((r) => setTimeout(r, 250));
      const ov = await overflowX(page);
      note(
        `catalog-overflow-${vp.name}`,
        ov.overflow ? "FAIL" : "PASS",
        `scrollWidth=${ov.scrollWidth} clientWidth=${ov.clientWidth}`,
      );
      await shot(page, `home-${vp.name}`);
    }

    // —— Listing detail ——
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + "/", { waitUntil: "networkidle2" });
    const listingPath = await page.$eval(".dark-card", (a) =>
      a.getAttribute("href"),
    );
    await page.goto(new URL(listingPath, BASE).href, {
      waitUntil: "networkidle2",
    });
    const detailTheme = await page.$eval(
      "[data-site-theme]",
      (el) => el.getAttribute("data-site-theme"),
    );
    note(
      "detail-theme",
      detailTheme === "dark" ? "PASS" : "FAIL",
      `theme=${detailTheme} path=${listingPath}`,
    );

    const detailBits = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasPrice: /\$|MXN|USD|\/mes|month/i.test(text),
        hasTitle: Boolean(document.querySelector("h1")),
        hasGallery: Boolean(
          document.querySelector(".listing-gallery--strip, .listing-gallery"),
        ),
        hasInquiry: Boolean(
          document.querySelector("form") ||
            document.querySelector("[class*='inquiry']"),
        ),
        hasShare: Boolean(
          document.querySelector(".dark-share, button, [class*='share']"),
        ),
        hasWhatsApp: [...document.querySelectorAll("a")].some((a) =>
          /wa\.me|whatsapp/i.test(a.href),
        ),
        descriptionLen: (
          document.querySelector(".dark-detail__description, .dark-detail__copy, main p")
            ?.textContent || ""
        ).trim().length,
        specs: document.querySelectorAll(".dark-detail__spec, .dark-detail__specs dt").length,
      };
    });
    note(
      "detail-content",
      detailBits.hasPrice && detailBits.hasTitle && detailBits.hasGallery
        ? "PASS"
        : "FAIL",
      JSON.stringify(detailBits),
    );

    // Gallery chrome
    const galleryState = await page.evaluate(() => {
      const strip = document.querySelector(".listing-gallery__strip");
      const slides = [...document.querySelectorAll(".listing-gallery__slide")];
      const thumbs = [...document.querySelectorAll(".listing-gallery__thumb")];
      const counter = document.querySelector(".listing-gallery__counter");
      const ratios = slides.map((s) => {
        const r = getComputedStyle(s).aspectRatio;
        const w = s.getBoundingClientRect().width;
        const h = s.getBoundingClientRect().height;
        return { r, w: Math.round(w), h: Math.round(h), landscape: w >= h };
      });
      return {
        slideCount: slides.length,
        thumbCount: thumbs.length,
        counter: counter?.textContent?.trim() || null,
        stripOverflow: strip
          ? strip.scrollWidth > strip.clientWidth + 1
          : false,
        ratios,
      };
    });
    note(
      "gallery-structure",
      galleryState.slideCount > 0 ? "PASS" : "FAIL",
      JSON.stringify(galleryState),
    );

    const targetThumb = thumbnailTarget(galleryState.thumbCount);
    if (targetThumb !== null) {
      const before = await page.$eval(
        ".listing-gallery__counter",
        (el) => el.textContent?.trim(),
      ).catch(() => null);
      await page.evaluate((index) => {
        const thumb = document.querySelectorAll(".listing-gallery__thumbs .listing-gallery__thumb")[index];
        if (!thumb) throw new Error("Expected gallery thumbnail missing");
        thumb.click();
      }, targetThumb);
      await new Promise((r) => setTimeout(r, 600));
      const after = await page.evaluate(() => ({
        counter: document.querySelector(".listing-gallery__counter")?.textContent?.trim(),
        activeThumb: [
          ...document.querySelectorAll(
            ".listing-gallery__thumbs .listing-gallery__thumb",
          ),
        ].findIndex((t) => t.getAttribute("aria-current") === "true"),
      }));
      note(
        "gallery-thumb-sync",
        thumbnailIsSynced(after, targetThumb)
          ? "PASS"
          : "FAIL",
        `before=${before} after=${JSON.stringify(after)}`,
      );
    } else {
      note("gallery-thumb-sync", "SKIP", "fewer than 2 thumbs");
    }

    // Next arrow
    const nextBtn = await page.$(".listing-gallery__nav--next");
    if (nextBtn) {
      const disabled = await page.$eval(".listing-gallery__nav--next", (b) =>
        b.hasAttribute("disabled"),
      );
      if (!disabled) {
        const c1 = await page.$eval(".listing-gallery__counter", (el) =>
          el.textContent?.trim(),
        );
        await nextBtn.click();
        await new Promise((r) => setTimeout(r, 400));
        const c2 = await page.$eval(".listing-gallery__counter", (el) =>
          el.textContent?.trim(),
        );
        note(
          "gallery-arrow",
          c1 !== c2 ? "PASS" : "FAIL",
          `${c1} → ${c2}`,
        );
      } else {
        note("gallery-arrow", "SKIP", "next disabled at start unexpectedly");
      }
    } else {
      note("gallery-arrow", "SKIP", "single photo or no next");
    }

    // Lightbox
    const viewAll = await page.$(".listing-gallery__view-all");
    if (viewAll) {
      await viewAll.focus();
      await viewAll.click();
      await page.waitForSelector(".listing-gallery-lightbox", { timeout: 5000 });
      const lbOpen = await page.$(".listing-gallery-lightbox");
      note("lightbox-open", lbOpen ? "PASS" : "FAIL", "dialog present");
      await shot(page, "listing-lightbox-1440");

      // Escape close + focus restore
      await page.keyboard.press("Escape");
      await new Promise((r) => setTimeout(r, 300));
      const lbGone = (await page.$(".listing-gallery-lightbox")) === null;
      const focusBack = await page.evaluate(
        () => document.activeElement?.classList?.contains("listing-gallery__view-all"),
      );
      note(
        "lightbox-escape-focus",
        lbGone && focusBack ? "PASS" : "FAIL",
        `closed=${lbGone} focusViewAll=${focusBack}`,
      );

      // Reopen and close via scrim corner (center is covered by the panel).
      await page.click(".listing-gallery__view-all");
      await page.waitForSelector(".listing-gallery-lightbox", { timeout: 5000 });
      await page.mouse.click(8, 8);
      await new Promise((r) => setTimeout(r, 300));
      const lbGone2 = (await page.$(".listing-gallery-lightbox")) === null;
      note("lightbox-scrim", lbGone2 ? "PASS" : "FAIL", `closed=${lbGone2}`);
    } else {
      note("lightbox-open", "SKIP", "no view-all control");
    }

    // Form: validation UI without submit to API
    const formInfo = await page.evaluate(() => {
      const form =
        document.querySelector("form[class*='inquiry']") ||
        document.querySelector(".dark-detail form") ||
        document.querySelector("form");
      if (!form) return { present: false };
      const submit = form.querySelector('button[type="submit"], input[type="submit"]');
      const required = [...form.querySelectorAll("[required]")].map((el) => el.name || el.id);
      return {
        present: true,
        action: form.getAttribute("action"),
        method: form.getAttribute("method"),
        required,
        submitLabel: submit?.textContent?.trim() || submit?.value || null,
      };
    });
    note(
      "inquiry-form-present",
      formInfo.present ? "PASS" : "FAIL",
      JSON.stringify(formInfo),
    );
    if (formInfo.present) {
      // Block all mutation requests while probing empty-form validation.
      await page.setRequestInterception(true);
      const blockMutation = (request) => {
        if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) request.abort();
        else request.continue();
      };
      page.on("request", blockMutation);
      const inquiryPath = new URL(page.url()).pathname;
      await page.evaluate(() => {
        const form =
          document.querySelector("form[class*='inquiry']") ||
          document.querySelector(".dark-detail form") ||
          document.querySelector("form");
        form?.querySelectorAll("input, textarea").forEach((el) => {
          if ("value" in el) el.value = "";
        });
      });
      const submit = await page.$(
        "form button[type='submit'], .dark-detail form button[type='submit']",
      );
      if (submit) {
        await submit.click();
        await new Promise((r) => setTimeout(r, 400));
        const validity = await page.evaluate(() => {
          const form =
            document.querySelector("form[class*='inquiry']") ||
            document.querySelector(".dark-detail form") ||
            document.querySelector("form");
          const invalid = form?.querySelector(":invalid");
          return {
            hasInvalid: Boolean(invalid),
            // ensure we did not navigate away
            path: location.pathname,
          };
        });
        note(
          "inquiry-no-send-empty",
          validity.hasInvalid ? "PASS" : "FAIL",
          JSON.stringify(validity),
        );
        note("inquiry-stays-on-detail", validity.path === inquiryPath ? "PASS" : "FAIL", validity.path);
      } else {
        note("inquiry-submit", "FAIL", "submit control missing");
      }
      await page.setRequestInterception(false);
      page.off("request", blockMutation);
    }

    // Share + WhatsApp destinations (no send)
    const links = await page.evaluate(() => {
      const wa = [...document.querySelectorAll("a")]
        .map((a) => a.href)
        .filter((h) => /wa\.me|api\.whatsapp/i.test(h));
      const shareBtn = document.querySelector(".dark-share button, [class*='share'] button");
      return {
        whatsapp: wa.slice(0, 3),
        hasShareControl: Boolean(shareBtn),
      };
    });
    note(
      "whatsapp-href",
      links.whatsapp.length > 0 ? "PASS" : "WARN",
      JSON.stringify(links),
    );
    // Do not click WhatsApp (would open external). Share: open UI if possible without navigator share send
    if (links.hasShareControl) {
      await page.click(".dark-share button, [class*='share'] button").catch(() => {});
      await new Promise((r) => setTimeout(r, 300));
      const shareUi = await page.evaluate(() =>
        document.body.innerText.match(/copiar|copy|compartir|share|facebook|x\.com|twitter/i)?.[0] || null,
      );
      note("share-ui", shareUi ? "PASS" : "WARN", `ui=${shareUi}`);
    } else {
      note("share-ui", "SKIP", "no share control");
    }

    // Detail viewports + keyboard focus ring sample
    for (const vp of VIEWPORTS) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
      });
      await new Promise((r) => setTimeout(r, 200));
      const ov = await overflowX(page);
      note(
        `detail-overflow-${vp.name}`,
        ov.overflow ? "FAIL" : "PASS",
        `scrollWidth=${ov.scrollWidth} clientWidth=${ov.clientWidth}`,
      );
      await shot(page, `listing-${vp.name}`);
    }

    // Keyboard: Tab to interactive control
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const focusTag = await page.evaluate(() => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement)) return { interactive: false };
      const style = getComputedStyle(element);
      const transparent = (color) => color === "transparent" || /rgba\([^)]*,\s*0\)$/.test(color);
      return {
        tag: element.tagName,
        interactive: element.matches('a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex], [contenteditable="true"]') && !element.matches(":disabled") && element.tabIndex >= 0,
        visible: element.getClientRects().length > 0 && style.visibility === "visible" && Number(style.opacity) > 0,
        focusVisible: element.matches(":focus-visible"),
        outline: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth),
        outlineVisible: !transparent(style.outlineColor),
        boxShadow: style.boxShadow,
      };
    });
    note(
      "keyboard-focus",
      hasVisibleInteractiveFocus(focusTag) ? "PASS" : "FAIL",
      JSON.stringify(focusTag),
    );
    await shot(page, "listing-focus-1440");
  } catch (error) {
    note("smoke-error", "FAIL", String(error));
    throw error;
  } finally {
    const report = {
      base: BASE,
      generatedAt: new Date().toISOString(),
      findings,
      summary: {
        pass: findings.filter((f) => f.status === "PASS").length,
        fail: findings.filter((f) => f.status === "FAIL").length,
        warn: findings.filter((f) => f.status === "WARN").length,
        skip: findings.filter((f) => f.status === "SKIP").length,
      },
    };
    fs.writeFileSync(
      path.join(OUT, "results.json"),
      JSON.stringify(report, null, 2),
    );
    console.log("\nSUMMARY", report.summary);
    if (report.summary.fail > 0) process.exitCode = 1;
    await browser?.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
