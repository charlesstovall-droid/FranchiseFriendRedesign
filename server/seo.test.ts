import assert from "node:assert/strict";
import { applySeoToHtml, resolveSeoPage, renderExecutiveAccessHtml } from "./seo";
import { AD_LANDING_REDIRECTS } from "./redirects";
import { SITE_ORIGIN, toWwwCanonical } from "../shared/site";

const shell = `<!DOCTYPE html>
<html>
  <head>
    <title>Charles Stovall | Expert Franchise Consulting in Charleston SC | Franchise Friend</title>
    <link rel="canonical" href="https://charlesstovall.com/" />
    <meta name="description" content="Homepage description" />
    <meta property="og:url" content="https://charlesstovall.com/" />
    <meta property="og:title" content="Homepage" />
    <meta property="og:description" content="Homepage description" />
    <meta property="og:type" content="website" />
    <meta name="twitter:url" content="https://charlesstovall.com/" />
    <meta name="twitter:title" content="Homepage" />
    <meta name="twitter:description" content="Homepage description" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

function assertPage(path: string, titleSnippet: string, extra: (html: string) => void) {
  const html = applySeoToHtml(shell, path);
  assert.match(html, new RegExp(`<title>[^<]*${titleSnippet}[^<]*</title>`));
  const page = resolveSeoPage(path);
  assert.ok(page);
  assert.equal(page.canonical.startsWith(SITE_ORIGIN), true);
  assert.doesNotMatch(html, /href="https:\/\/charlesstovall\.com[^w]/);
  extra(html);
}

assertPage("/blog/fdd-red-flags", "FDD Red Flags", (html) => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/blog\/fdd-red-flags"/);
  assert.match(html, /<article>/);
  assert.match(html, /Item 19/);
  assert.match(html, /<div id="root">/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
});

assertPage("/blog", "Franchise Insights", (html) => {
  assert.match(html, /href="\/blog\/fdd-red-flags"/);
  assert.match(html, /href="\/blog\/2026-franchise-outlook-boring-businesses"/);
});

assertPage("/executive-access", "Executive Access", (html) => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/executive-access"/);
  assert.match(html, /id="executive-assessment-form"/);
  assert.match(html, /action="\/api\/leads"/);
  assert.match(html, /name="firstName"/);
  assert.match(html, /name="lastName"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="phone"/);
  assert.match(html, /Keep the W-2/);
});

assert.equal(AD_LANDING_REDIRECTS["/executive/access"], "/executive-access");
assert.equal(AD_LANDING_REDIRECTS["/executive/ownership"], "/executive-access");
assert.equal(AD_LANDING_REDIRECTS["/home-based/franchises"], "/home-based-franchises");

assert.equal(toWwwCanonical("https://charlesstovall.com/blog"), "https://www.charlesstovall.com/blog");
assert.equal(toWwwCanonical("/faq"), "https://www.charlesstovall.com/faq");

const exec = renderExecutiveAccessHtml().toLowerCase();
for (const banned of ["compensat", "franchoice", "you pay nothing", "franchisor pays", "free to you"]) {
  assert.equal(exec.includes(banned), false, `landing SSR should not include "${banned}"`);
}

const chromeUaHtml = applySeoToHtml(shell, "/blog/fdd-red-flags");
const botUaHtml = applySeoToHtml(shell, "/blog/fdd-red-flags");
assert.equal(chromeUaHtml, botUaHtml);

console.log("seo.test.ts passed");
