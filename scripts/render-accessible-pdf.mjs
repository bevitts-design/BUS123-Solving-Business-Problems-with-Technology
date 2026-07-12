#!/usr/bin/env node
/** Render semantic HTML as a tagged PDF using the Chrome DevTools protocol. */

import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const [htmlPath, outputPath] = process.argv.slice(2);
if (!htmlPath || !outputPath) {
  console.error("usage: render-accessible-pdf.mjs INPUT.html OUTPUT.pdf");
  process.exit(2);
}

const bundledModules = "/Users/bethanyevittsair2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  const require = createRequire(`${bundledModules}/package.json`);
  ({ chromium } = require("playwright"));
}

const chrome = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!fs.existsSync(chrome)) {
  throw new Error(`Google Chrome not found at ${chrome}. Set CHROME_PATH to a Chrome or Chromium executable.`);
}

const browser = await chromium.launch({ headless: true, executablePath: chrome });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  const client = await page.context().newCDPSession(page);
  const result = await client.send("Page.printToPDF", {
    printBackground: true,
    preferCSSPageSize: true,
    generateTaggedPDF: true,
    generateDocumentOutline: true,
  });
  fs.writeFileSync(outputPath, Buffer.from(result.data, "base64"));
} finally {
  await browser.close();
}
