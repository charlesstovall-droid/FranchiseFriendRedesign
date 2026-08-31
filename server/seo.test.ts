import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { applySeoToHtml, resolveSeoPage, renderExecutiveAccessHtml, renderHomeHtml, renderCharlestonHtml, renderAboutHtml, sitemapUrls, pathnameFromRequest } from "./seo";
import { mountClientStatic } from "./serve-client";
import { mountPlainSiteFiles } from "./plain-files";
import { AD_LANDING_REDIRECTS, BLACK_BOOK_REDIRECTS, OLD_ASSESSMENT_REDIRECTS, seoRedirects } from "./redirects";
import { SITE_ORIGIN, toWwwCanonical } from "../shared/site";
import { GOOGLE_SITE_VERIFICATION, GOOGLE_VERIFICATION_BODY, GOOGLE_VERIFICATION_FILENAME, NAP, NAP_GEO, OG_IMAGE_URL } from "../shared/nap";

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

assertPage("/charleston", "Charleston Franchise Consultant", (html) => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/charleston"/);
  assert.match(html, /Own a Business in Charleston/);
  assert.match(html, /Without Starting One From Scratch/);
  assert.match(html, /I live in this market/);
  assert.match(html, /The Lowcountry is not a national slide/);
  assert.match(html, /Mt\. Pleasant/);
  assert.match(html, /Daniel Island/);
  assert.match(html, /Lowcountry/);
  assert.match(html, /How it works/i);
  assert.match(html, /id="charleston-consultation-form"/);
  assert.match(html, /action="\/api\/leads"/);
  assert.match(html, /name="firstName"/);
  assert.match(html, /name="lastName"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="phone"/);
  assert.match(html, /name="liquidCapital"/);
  assert.match(html, /leadType" value="charleston-ad"/);
  assert.match(html, /src="\/cs-shield-logo\.png"/);
  assert.match(html, /src="\/charles-homepage-portrait\.jpg"/);
  assert.doesNotMatch(html, /src="\/charles-headshot\.jpeg"/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
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

assert.equal(BLACK_BOOK_REDIRECTS["/black-book"], "/");
assert.equal(BLACK_BOOK_REDIRECTS["/blackbook"], "/");
assert.equal(BLACK_BOOK_REDIRECTS["/the-blackbook-of-franchising"], "/");
assert.equal(BLACK_BOOK_REDIRECTS["/black-book-of-franchising"], "/");
assert.equal(BLACK_BOOK_REDIRECTS["/the-black-book-of-franchising"], "/");
assert.equal(BLACK_BOOK_REDIRECTS["/free-franchise-guide"], "/");
assert.equal(BLACK_BOOK_REDIRECTS["/thank-you-franchise-guide"], "/");
assert.equal(OLD_ASSESSMENT_REDIRECTS["/franchise-assessment"], "/advisor");
assert.equal(OLD_ASSESSMENT_REDIRECTS["/assessment"], "/advisor");
assert.equal(OLD_ASSESSMENT_REDIRECTS["/franchise-quiz"], "/advisor");
assert.equal(OLD_ASSESSMENT_REDIRECTS["/readiness"], "/advisor");
assert.equal(resolveSeoPage("/franchise-assessment"), null);
assert.equal(resolveSeoPage("/black-book"), null);

assert.equal(toWwwCanonical("https://charlesstovall.com/blog"), "https://www.charlesstovall.com/blog");
assert.equal(toWwwCanonical("/faq"), "https://www.charlesstovall.com/faq");

const exec = renderExecutiveAccessHtml().toLowerCase();
const home = renderHomeHtml().toLowerCase();
const charleston = renderCharlestonHtml().toLowerCase();
for (const banned of ["compensat", "franchoice", "you pay nothing", "franchisor pays", "free to you"]) {
  assert.equal(exec.includes(banned), false, `landing SSR should not include "${banned}"`);
  assert.equal(home.includes(banned), false, `homepage SSR should not include "${banned}"`);
  assert.equal(charleston.includes(banned), false, `charleston SSR should not include "${banned}"`);
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
const charlestonHtml = await (await fetch(`http://127.0.0.1:${prodPort}/charleston`, { headers: { "user-agent": chromeUa } })).text();
assert.match(charlestonHtml, /<title>Charleston Franchise Consultant/);
assert.match(charlestonHtml, /canonical" href="https:\/\/www\.charlesstovall\.com\/charleston"/);
assert.match(charlestonHtml, /Own a Business in Charleston/);
assert.match(charlestonHtml, /id="charleston-consultation-form"/);
assert.doesNotMatch(charlestonHtml, /<div id="root"><\/div>/);
const fddHtml = await (await fetch(`http://127.0.0.1:${prodPort}/blog/fdd-red-flags`, { headers: { "user-agent": chromeUa } })).text();
assert.match(fddHtml, /<title>FDD Red Flags/);
assert.match(fddHtml, /<article>/);
assert.match(fddHtml, /Item 19/);
await new Promise<void>((resolve, reject) => prodServer.close((err) => err ? reject(err) : resolve()));

const staticDir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-static-"));
fs.writeFileSync(path.join(staticDir, "index.html"), shell);
fs.writeFileSync(path.join(staticDir, "cs-shield-logo.png"), "png");

const liveBugApp = express();
liveBugApp.use(express.static(staticDir));
liveBugApp.use((req, res) => {
  res.status(200).type("html").send(applySeoToHtml(shell, pathnameFromRequest(req)));
});
const liveBugServer = await new Promise<import("node:http").Server>((resolve) => {
  const server = liveBugApp.listen(0, "127.0.0.1", () => resolve(server));
});
const liveBugPort = (liveBugServer.address() as { port: number }).port;
const rawHome = await (await fetch(`http://127.0.0.1:${liveBugPort}/`, { headers: { "user-agent": chromeUa } })).text();
assert.match(rawHome, /<div id="root"><\/div>/);
assert.match(rawHome, /Expert Franchise Consulting in Charleston SC/);
assert.doesNotMatch(rawHome, /Invest in Yourself/);
const rawExec = await (await fetch(`http://127.0.0.1:${liveBugPort}/executive-access`, { headers: { "user-agent": chromeUa } })).text();
assert.match(rawExec, /Keep the W-2/);
await new Promise<void>((resolve, reject) => liveBugServer.close((err) => err ? reject(err) : resolve()));

const fixedApp = express();
mountClientStatic(fixedApp, staticDir);
const fixedServer = await new Promise<import("node:http").Server>((resolve) => {
  const server = fixedApp.listen(0, "127.0.0.1", () => resolve(server));
});
const fixedPort = (fixedServer.address() as { port: number }).port;
const fixedHome = await (await fetch(`http://127.0.0.1:${fixedPort}/`, { headers: { "user-agent": chromeUa } })).text();
assert.match(fixedHome, /<title>Charles Stovall \| Your Franchise Friend/);
assert.match(fixedHome, /canonical" href="https:\/\/www\.charlesstovall\.com\/"/);
assert.match(fixedHome, /Invest in Yourself/);
assert.match(fixedHome, /I have sat on your side of the table/);
assert.match(fixedHome, /src="\/cs-shield-logo\.png"/);
assert.doesNotMatch(fixedHome, /<div id="root"><\/div>/);
assert.doesNotMatch(fixedHome, /Expert Franchise Consulting in Charleston SC/);
const fixedIndexHtml = await (await fetch(`http://127.0.0.1:${fixedPort}/index.html`, { headers: { "user-agent": chromeUa } })).text();
assert.match(fixedIndexHtml, /Invest in Yourself/);
const fixedExec = await (await fetch(`http://127.0.0.1:${fixedPort}/executive-access`, { headers: { "user-agent": chromeUa } })).text();
assert.match(fixedExec, /Keep the W-2/);
assert.match(fixedExec, /id="executive-assessment-form"/);
const png = await fetch(`http://127.0.0.1:${fixedPort}/cs-shield-logo.png`);
assert.equal(png.status, 200);
await new Promise<void>((resolve, reject) => fixedServer.close((err) => err ? reject(err) : resolve()));
fs.rmSync(staticDir, { recursive: true, force: true });

const homeSeo = applySeoToHtml(shell, "/");
assert.match(homeSeo, new RegExp(`<meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}"`));
assert.match(homeSeo, /"@id":"https:\/\/www\.charlesstovall\.com\/#person"/);
assert.match(homeSeo, /"@id":"https:\/\/www\.charlesstovall\.com\/#localbusiness"/);
assert.match(homeSeo, /"@id":"https:\/\/www\.charlesstovall\.com\/#organization"/);
assert.match(homeSeo, /"name":"Charles Stovall Your Franchise Friend"/);
assert.match(homeSeo, /"streetAddress":"1531 N Lakeshore Dr"/);
assert.match(homeSeo, /"addressLocality":"Mt Pleasant"/);
assert.match(homeSeo, /"postalCode":"29466"/);
assert.match(homeSeo, /"telephone":"\+1-919-827-3921"/);
assert.match(homeSeo, /https:\/\/www\.linkedin\.com\/in\/charles-stovall\//);
assert.match(homeSeo, /https:\/\/x\.com\/chuckstovall/);
assert.match(homeSeo, /https:\/\/www\.instagram\.com\/thefranchisefriend/);
assert.match(homeSeo, /https:\/\/www\.franchoice\.com\/our-consultants\/charles-stovall\//);
assert.match(homeSeo, /business\.mountpleasantchamber\.org/);
assert.match(homeSeo, new RegExp(`"latitude":${NAP_GEO.latitude}`));
assert.match(homeSeo, new RegExp(`"longitude":${NAP_GEO.longitude}`));
assert.doesNotMatch(homeSeo, /32\.7765/);
assert.doesNotMatch(homeSeo, /-79\.9311/);
assert.doesNotMatch(homeSeo, /"@id":"https:\/\/www\.charlesstovall\.com\/"/);
assert.doesNotMatch(homeSeo, /"addressLocality":"Charleston"/);
assert.match(homeSeo, new RegExp(`og:image" content="${OG_IMAGE_URL}"`));
assert.doesNotMatch(homeSeo, /replit\.app/);
assert.match(homeSeo, /href="\/charleston"/);
assert.match(homeSeo, /href="\/blog\/fdd-red-flags"/);
assert.match(homeSeo, /1531 N Lakeshore Dr/);

const fddSeo = applySeoToHtml(shell, "/blog/fdd-red-flags");
assert.match(fddSeo, /"@type":"BlogPosting"/);
assert.match(fddSeo, /"headline":"FDD Red Flags I Learned the Hard Way"/);
assert.match(fddSeo, /"datePublished":"2026-08-14"/);
assert.match(fddSeo, /"dateModified":"2026-08-14"/);
assert.match(fddSeo, /"author":\{"@id":"https:\/\/www\.charlesstovall\.com\/#person"\}/);
assert.match(fddSeo, /"publisher":\{"@id":"https:\/\/www\.charlesstovall\.com\/#organization"\}/);
assert.match(fddSeo, /"mainEntityOfPage":"https:\/\/www\.charlesstovall\.com\/blog\/fdd-red-flags"/);
assert.match(fddSeo, /article:published_time" content="2026-08-14"/);
assert.match(fddSeo, new RegExp(`<meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}"`));

const faqSeo = applySeoToHtml(shell, "/faq");
assert.match(faqSeo, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/faq"/);
assert.doesNotMatch(faqSeo, /<div id="root"><\/div>/);
assert.match(faqSeo, /What does a franchise consultant do\?/);
assert.match(faqSeo, /How much money do I need to invest in a franchise\?/);
assert.match(faqSeo, /"@type":"FAQPage"/);
assert.match(faqSeo, /1531 N Lakeshore Dr/);

const aboutSeo = applySeoToHtml(shell, "/about");
assert.match(aboutSeo, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/about"/);
assert.match(aboutSeo, /<meta property="og:url" content="https:\/\/www\.charlesstovall\.com\/about"/);
assert.doesNotMatch(aboutSeo, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/"/);
assert.doesNotMatch(aboutSeo, /<div id="root"><\/div>/);
assert.match(aboutSeo, /About Charles Stovall/);
assert.match(aboutSeo, /1531 N Lakeshore Dr/);
assert.match(aboutSeo, /Mt Pleasant/);
assert.match(aboutSeo, /30 locations/);

const charlestonSeo = applySeoToHtml(shell, "/charleston");
assert.match(charlestonSeo, /"@type":"FAQPage"/);
assert.match(charlestonSeo, /Item 19/);
assert.match(charlestonSeo, /labor costs in Mt. Pleasant/);
assert.match(charlestonSeo, /1531 N Lakeshore Dr/);

const execSeo = applySeoToHtml(shell, "/executive-access");
assert.match(execSeo, /"@type":"FAQPage"/);
assert.match(execSeo, /Item 19/);

assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/about"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/faq"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/advisor"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/black-book"), false);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/franchise-assessment"), false);

const robotsTxt = fs.readFileSync(path.resolve("client/public/robots.txt"), "utf-8");
assert.doesNotMatch(robotsTxt, /franchisefriend\.net/);
assert.match(robotsTxt, /Sitemap: https:\/\/www\.charlesstovall\.com\/sitemap\.xml/);

const aboutSsr = renderAboutHtml().toLowerCase();
for (const banned of ["compensat", "you pay nothing", "franchisor pays", "free to you"]) {
  assert.equal(aboutSsr.includes(banned), false, `about SSR should not include "${banned}"`);
}

const plainApp = express();
mountPlainSiteFiles(plainApp);
const plainServer = await new Promise<import("node:http").Server>((resolve) => {
  const server = plainApp.listen(0, "127.0.0.1", () => resolve(server));
});
const plainPort = (plainServer.address() as { port: number }).port;
const gscRes = await fetch(`http://127.0.0.1:${plainPort}/${GOOGLE_VERIFICATION_FILENAME}`);
assert.equal(gscRes.status, 200);
assert.match(gscRes.headers.get("content-type") || "", /text\/html/);
assert.equal((await gscRes.text()).trim(), GOOGLE_VERIFICATION_BODY);
const llmsRes = await fetch(`http://127.0.0.1:${plainPort}/llms.txt`);
assert.equal(llmsRes.status, 200);
const llmsBody = await llmsRes.text();
assert.match(llmsBody, /Charles Stovall Your Franchise Friend/);
assert.match(llmsBody, /1531 N Lakeshore Dr/);
assert.match(llmsBody, /\/charleston/);
assert.match(llmsBody, /\/executive-access/);
assert.match(llmsBody, /\/blog\/fdd-red-flags/);
assert.match(llmsBody, /\/faq/);
assert.match(llmsBody, /\/about/);
assert.match(llmsBody, /franchoice\.com\/our-consultants\/charles-stovall/);
assert.match(llmsBody, /mountpleasantchamber\.org/);
assert.doesNotMatch(llmsBody, /black-book|blackbook|franchise-assessment/i);
await new Promise<void>((resolve, reject) => plainServer.close((err) => err ? reject(err) : resolve()));

const redirectApp = express();
redirectApp.use(seoRedirects);
redirectApp.use((_req, res) => res.status(200).send("ok"));
const redirectServer = await new Promise<import("node:http").Server>((resolve) => {
  const server = redirectApp.listen(0, "127.0.0.1", () => resolve(server));
});
const redirectPort = (redirectServer.address() as { port: number }).port;
async function assertRedirect(from: string, to: string) {
  const res = await fetch(`http://127.0.0.1:${redirectPort}${from}`, { redirect: "manual" });
  assert.equal(res.status, 301, `${from} should 301`);
  assert.equal(res.headers.get("location"), to, `${from} should 301 to ${to}`);
}
await assertRedirect("/black-book", "/");
await assertRedirect("/blackbook", "/");
await assertRedirect("/free-franchise-guide", "/");
await assertRedirect("/franchise-assessment", "/advisor");
await assertRedirect("/assessment", "/advisor");
await new Promise<void>((resolve, reject) => redirectServer.close((err) => err ? reject(err) : resolve()));

assert.equal(NAP.addressLocality, "Mt Pleasant");
assert.equal(NAP.postalCode, "29466");

console.log("seo.test.ts passed");
