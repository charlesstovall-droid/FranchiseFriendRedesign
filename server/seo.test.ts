import assert from "node:assert/strict";
import express from "express";
import { applySeoToHtml, resolveSeoPage, renderExecutiveAccessHtml, renderHomeHtml, pathnameFromRequest } from "./seo";
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

assertPage("/", "Your Franchise Friend", (html) => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/"/);
  assert.match(html, /Invest in Yourself/);
  assert.match(html, /I have sat on your side of the table/);
  assert.match(html, /30 locations/);
  assert.match(html, /4 brands/);
  assert.match(html, /private equity/i);
  assert.match(html, /src="\/cs-shield-logo\.png"/);
  assert.match(html, /src="\/charles-headshot\.jpeg"/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.doesNotMatch(html, /Expert Franchise Consulting in Charleston SC/);
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
  assert.match(html, /src="\/charles-headshot\.jpeg"/);
  assert.match(html, /src="\/cs-shield-logo\.png"/);
});

assert.equal(AD_LANDING_REDIRECTS["/executive/access"], "/executive-access");
assert.equal(AD_LANDING_REDIRECTS["/executive/ownership"], "/executive-access");
assert.equal(AD_LANDING_REDIRECTS["/home-based/franchises"], "/home-based-franchises");

assert.equal(toWwwCanonical("https://charlesstovall.com/blog"), "https://www.charlesstovall.com/blog");
assert.equal(toWwwCanonical("/faq"), "https://www.charlesstovall.com/faq");

const exec = renderExecutiveAccessHtml().toLowerCase();
const home = renderHomeHtml().toLowerCase();
for (const banned of ["compensat", "franchoice", "you pay nothing", "franchisor pays", "free to you"]) {
  assert.equal(exec.includes(banned), false, `landing SSR should not include "${banned}"`);
  assert.equal(home.includes(banned), false, `homepage SSR should not include "${banned}"`);
}

const chromeUaHtml = applySeoToHtml(shell, "/blog/fdd-red-flags");
const botUaHtml = applySeoToHtml(shell, "/blog/fdd-red-flags");
assert.equal(chromeUaHtml, botUaHtml);

assert.equal(pathnameFromRequest({ path: "/", originalUrl: "/executive-access" }), "/executive-access");
assert.equal(pathnameFromRequest({ path: "/", originalUrl: "/blog/fdd-red-flags?utm=1" }), "/blog/fdd-red-flags");
assert.equal(pathnameFromRequest({ path: "/" }), "/");

const probe = express();
probe.use("*", (req, res) => {
  res.json({ path: req.path, originalUrl: req.originalUrl, resolved: pathnameFromRequest(req) });
});
const starServer = await new Promise<import("node:http").Server>((resolve) => {
  const server = probe.listen(0, "127.0.0.1", () => resolve(server));
});
const starPort = (starServer.address() as { port: number }).port;
const starBody = await (await fetch(`http://127.0.0.1:${starPort}/executive-access`)).json();
assert.equal(starBody.path, "/");
assert.equal(starBody.originalUrl, "/executive-access");
assert.equal(starBody.resolved, "/executive-access");
await new Promise<void>((resolve, reject) => starServer.close((err) => err ? reject(err) : resolve()));

const prodApp = express();
prodApp.use((req, res) => {
  res.status(200).type("html").send(applySeoToHtml(shell, pathnameFromRequest(req)));
});
const prodServer = await new Promise<import("node:http").Server>((resolve) => {
  const server = prodApp.listen(0, "127.0.0.1", () => resolve(server));
});
const prodPort = (prodServer.address() as { port: number }).port;
const chromeUa = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const homeHtml = await (await fetch(`http://127.0.0.1:${prodPort}/`, { headers: { "user-agent": chromeUa } })).text();
assert.match(homeHtml, /<title>Charles Stovall \| Your Franchise Friend/);
assert.match(homeHtml, /canonical" href="https:\/\/www\.charlesstovall\.com\/"/);
assert.match(homeHtml, /Invest in Yourself/);
assert.match(homeHtml, /src="\/cs-shield-logo\.png"/);
assert.match(homeHtml, /src="\/charles-headshot\.jpeg"/);
assert.doesNotMatch(homeHtml, /<div id="root"><\/div>/);
const execHtml = await (await fetch(`http://127.0.0.1:${prodPort}/executive-access`, { headers: { "user-agent": chromeUa } })).text();
assert.match(execHtml, /<title>Executive Access/);
assert.match(execHtml, /canonical" href="https:\/\/www\.charlesstovall\.com\/executive-access"/);
assert.match(execHtml, /id="executive-assessment-form"/);
assert.match(execHtml, /src="\/cs-shield-logo\.png"/);
assert.match(execHtml, /src="\/charles-headshot\.jpeg"/);
const fddHtml = await (await fetch(`http://127.0.0.1:${prodPort}/blog/fdd-red-flags`, { headers: { "user-agent": chromeUa } })).text();
assert.match(fddHtml, /<title>FDD Red Flags/);
assert.match(fddHtml, /<article>/);
assert.match(fddHtml, /Item 19/);
await new Promise<void>((resolve, reject) => prodServer.close((err) => err ? reject(err) : resolve()));

console.log("seo.test.ts passed");
