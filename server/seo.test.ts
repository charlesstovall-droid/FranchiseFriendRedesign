import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import express from "express";
import { applySeoToHtml, resolveSeoPage, renderExecutiveAccessHtml, renderHomeHtml, renderCharlestonHtml, renderAboutHtml, renderLocalMarketHtml, sitemapUrls, pathnameFromRequest, statusForPath } from "./seo";
import { localMarketWordCount, mountPleasantPage, southCarolinaPage } from "../shared/local-markets";
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
  assert.match(html, /href="\/blog\/how-i-read-an-fdd-in-20-minutes"/);
  assert.match(html, /<div id="root">/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
});

assertPage("/blog/how-i-read-an-fdd-in-20-minutes", "How I Actually Read an FDD", (html) => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/blog\/how-i-read-an-fdd-in-20-minutes"/);
  assert.match(html, /<article>/);
  assert.match(html, /Item 20/);
  assert.match(html, /href="\/blog\/fdd-red-flags"/);
  assert.match(html, /<div id="root">/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
});

assertPage("/blog", "Franchise Insights", (html) => {
  assert.match(html, /href="\/blog\/fdd-red-flags"/);
  assert.match(html, /href="\/blog\/how-i-read-an-fdd-in-20-minutes"/);
  assert.match(html, /href="\/blog\/2026-franchise-outlook-boring-businesses"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/blog"/);
  assert.doesNotMatch(html, /noindex/);
});

function assertNotFoundHtml(html: string, heading: RegExp) {
  assert.match(html, heading);
  assert.match(html, /<meta name="robots" content="noindex"\s*\/?>/);
  assert.doesNotMatch(html, /<link\s+rel=["']canonical["']/);
  assert.doesNotMatch(html, /<meta\s+property=["']og:url["']/);
  assert.doesNotMatch(html, /<meta\s+name=["']twitter:url["']/);
  assert.match(html, /<div id="root">/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
}

const missingSlug = "/blog/this-post-does-not-exist";
const missingSlugPage = resolveSeoPage(missingSlug);
assert.ok(missingSlugPage);
assert.equal(missingSlugPage.noindex, true);
assert.equal(missingSlugPage.canonical, undefined);
assert.equal(statusForPath(missingSlug), 404);
assertNotFoundHtml(applySeoToHtml(shell, missingSlug), /<h1>Post Not Found<\/h1>/);
const missingSlugHtml = applySeoToHtml(shell, missingSlug);
assert.match(missingSlugHtml, /The blog post you're looking for doesn't exist/);
assert.match(missingSlugHtml, /href="\/blog"/);
assert.doesNotMatch(missingSlugHtml, /https:\/\/www\.charlesstovall\.com\/blog"/);
assert.doesNotMatch(missingSlugHtml, /https:\/\/charlesstovall\.com\/blog"/);

const missingRoute = "/this-route-does-not-exist";
assert.equal(resolveSeoPage(missingRoute), null);
assert.equal(statusForPath(missingRoute), 404);
assertNotFoundHtml(applySeoToHtml(shell, missingRoute), /<h1>404 Page Not Found<\/h1>/);
assert.match(applySeoToHtml(shell, missingRoute), /Did you forget to add the page to the router\?/);
assert.equal(statusForPath("/blog/also-missing/nested"), 404);
assertNotFoundHtml(applySeoToHtml(shell, "/blog/also-missing/nested"), /<h1>404 Page Not Found<\/h1>/);

for (const loc of sitemapUrls()) {
  const pathname = new URL(loc).pathname;
  assert.equal(statusForPath(pathname), 200, `${pathname} is in the sitemap and must stay 200`);
  const html = applySeoToHtml(shell, pathname);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex"/, pathname);
}
assert.equal(statusForPath("/blog/fdd-red-flags"), 200);
assert.equal(statusForPath("/speaking"), 200);
assert.equal(statusForPath("/franchise-brands"), 200);
assert.equal(statusForPath("/privacy-policy"), 200);
assert.equal(statusForPath("/advisor/report/example-token"), 200);
assert.equal(statusForPath("/advisor/resume/example-token"), 200);
assert.equal(statusForPath("/admin/advisor/candidates/123"), 200);
assert.equal(statusForPath("/"), 200);

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
  assert.match(html, /5\.0 · 40 Google Reviews/);
  assert.match(html, /Nishita P/);
  assert.match(html, /Chad Arsich/);
  assert.match(html, /Khamari McGriff/);
  assert.match(html, /listens to  what your looking for/);
  assert.match(html, /&quot;salesy&quot;/);
  assert.match(html, /"ratingValue":"5.0"/);
  assert.match(html, /"reviewCount":40/);
  assert.doesNotMatch(html, /37 Google|38 Google/);
  assert.doesNotMatch(html, /"reviewCount":37|"reviewCount":38/);
  assert.doesNotMatch(html, /Doug Marshall|Charles Wallace|Baseball 55/);
  assert.doesNotMatch(html, /commission/i);
});

function assertJsonLd(html: string) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length > 0);
  for (const block of blocks) {
    const parsed = JSON.parse(block[1]);
    assert.ok(parsed);
  }
}

assertPage("/mount-pleasant", "Franchise Consultant Mount Pleasant SC", (html) => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/mount-pleasant"/);
  assert.match(html, /<title>Franchise Consultant Mount Pleasant SC \| Charles Stovall, Your Franchise Friend<\/title>/);
  assert.match(html, /Mount Pleasant Is Where I Live/);
  assert.match(html, /Point Hope/);
  assert.match(html, /Clements Ferry/);
  assert.match(html, /Berkeley County/);
  assert.match(html, /Shem Creek/);
  assert.match(html, /Towne Centre/);
  assert.match(html, /Belle Hall/);
  assert.match(html, /id="mount-pleasant-consultation-form"/);
  assert.match(html, /leadType" value="mount-pleasant"/);
  assert.match(html, /href="\/charleston"/);
  assert.match(html, /href="\/blog\/fdd-red-flags"/);
  assert.match(html, /href="\/blog\/how-i-read-an-fdd-in-20-minutes"/);
  assert.match(html, /calendly\.com\/charles-stovall\/intro/);
  assert.match(html, /95,469/);
  assert.match(html, /\$748,500/);
  assert.match(html, /<h2>Sources<\/h2>/);
  assert.match(html, /pointhopecharleston\.com/);
  assert.match(html, /census\.gov/);
  assert.match(html, /"@type":\["ProfessionalService","LocalBusiness"\]/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"name":"Charles Stovall Your Franchise Friend"/);
  assert.match(html, /"streetAddress":"1531 N Lakeshore Dr"/);
  assert.match(html, /"telephone":"\(919\) 827-3921"/);
  assert.match(html, /1531 N Lakeshore Dr/);
  assert.match(html, /"ratingValue":"5.0"/);
  assert.match(html, /"reviewCount":40/);
  assert.doesNotMatch(html, /"reviewCount":37|"reviewCount":38/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assertJsonLd(html);
});

assertPage("/south-carolina", "Franchise Consultant South Carolina", (html) => {
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/south-carolina"/);
  assert.match(html, /<title>Franchise Consultant South Carolina \| Charles Stovall<\/title>/);
  assert.match(html, /South Carolina Is Not One Franchise Market/);
  assert.match(html, /Greenville/);
  assert.match(html, /Spartanburg/);
  assert.match(html, /Columbia/);
  assert.match(html, /Myrtle Beach/);
  assert.match(html, /Hilton Head/);
  assert.match(html, /Bluffton/);
  assert.match(html, /Berkeley/);
  assert.match(html, /Summerville/);
  assert.match(html, /5,570,274/);
  assert.match(html, /66,622/);
  assert.match(html, /id="south-carolina-consultation-form"/);
  assert.match(html, /leadType" value="south-carolina"/);
  assert.match(html, /href="\/charleston"/);
  assert.match(html, /href="\/mount-pleasant"/);
  assert.match(html, /href="\/blog\/fdd-red-flags"/);
  assert.match(html, /href="\/blog\/how-i-read-an-fdd-in-20-minutes"/);
  assert.match(html, /calendly\.com\/charles-stovall\/intro/);
  assert.match(html, /<h2>Sources<\/h2>/);
  assert.match(html, /sccommerce\.com/);
  assert.match(html, /"@type":\["ProfessionalService","LocalBusiness"\]/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"streetAddress":"1531 N Lakeshore Dr"/);
  assert.match(html, /"telephone":"\(919\) 827-3921"/);
  assert.match(html, /"ratingValue":"5.0"/);
  assert.match(html, /"reviewCount":40/);
  assert.doesNotMatch(html, /"reviewCount":37|"reviewCount":38/);
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assertJsonLd(html);
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
  assert.match(html, /"ratingValue":"5.0"/);
  assert.match(html, /"reviewCount":40/);
  assert.doesNotMatch(html, /"reviewCount":37|"reviewCount":38/);
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
const mountPleasant = renderLocalMarketHtml(mountPleasantPage).toLowerCase();
const southCarolina = renderLocalMarketHtml(southCarolinaPage).toLowerCase();
for (const banned of ["compensat", "franchoice", "you pay nothing", "franchisor pays", "free to you", "referral fee", "placement fee"]) {
  assert.equal(exec.includes(banned), false, `landing SSR should not include "${banned}"`);
  assert.equal(home.includes(banned), false, `homepage SSR should not include "${banned}"`);
  assert.equal(charleston.includes(banned), false, `charleston SSR should not include "${banned}"`);
  assert.equal(mountPleasant.includes(banned), false, `mount pleasant SSR should not include "${banned}"`);
  assert.equal(southCarolina.includes(banned), false, `south carolina SSR should not include "${banned}"`);
}

const homeRaw = renderHomeHtml();
assert.equal(homeRaw.split("500").length - 1, 1, "Inc. 500 should appear once in homepage SSR");
assert.doesNotMatch(homeRaw, /opacity:\s*0/);
assert.doesNotMatch(homeRaw, /no fees|black-book|franchise-assessment/i);
assert.match(homeRaw, /Intro Call/);
assert.match(homeRaw, /Due Diligence/);
assert.match(homeRaw, /5\.0 · 40 Google Reviews/);
assert.match(homeRaw, /Nishita P/);
assert.match(homeRaw, /Chad Arsich/);
assert.match(homeRaw, /Khamari McGriff/);
assert.match(homeRaw, /DK Patel/);
assert.match(homeRaw, /Brandon Dunevant/);
assert.doesNotMatch(homeRaw, /Doug Marshall/);
assert.doesNotMatch(homeRaw, /commission/i);
assert.match(homeRaw, /href="\/privacy-policy"/);
assert.match(homeRaw, /href="\/executive-access"/);

for (const page of [mountPleasantPage, southCarolinaPage]) {
  const words = localMarketWordCount(page);
  assert.ok(words >= 900 && words <= 1350, `${page.path} should be about 900–1,300 words, got ${words}`);
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
const googlebot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const mpBot = await (await fetch(`http://127.0.0.1:${prodPort}/mount-pleasant`, { headers: { "user-agent": googlebot } })).text();
const mpChrome = await (await fetch(`http://127.0.0.1:${prodPort}/mount-pleasant`, { headers: { "user-agent": chromeUa } })).text();
assert.equal(mpBot, mpChrome);
assert.match(mpBot, /<title>Franchise Consultant Mount Pleasant SC \| Charles Stovall, Your Franchise Friend<\/title>/);
assert.match(mpBot, /Point Hope/);
assert.match(mpBot, /<article>/);
assert.doesNotMatch(mpBot, /<div id="root"><\/div>/);
const scBot = await (await fetch(`http://127.0.0.1:${prodPort}/south-carolina`, { headers: { "user-agent": googlebot } })).text();
assert.match(scBot, /<title>Franchise Consultant South Carolina \| Charles Stovall<\/title>/);
assert.match(scBot, /Greenville/);
assert.match(scBot, /<article>/);
assert.doesNotMatch(scBot, /<div id="root"><\/div>/);
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

const missingSlugRes = await fetch(`http://127.0.0.1:${fixedPort}/blog/this-post-does-not-exist`, { headers: { "user-agent": chromeUa } });
assert.equal(missingSlugRes.status, 404);
assert.match(missingSlugRes.headers.get("content-type") || "", /text\/html/);
const missingSlugBody = await missingSlugRes.text();
assert.match(missingSlugBody, /<h1>Post Not Found<\/h1>/);
assert.match(missingSlugBody, /<meta name="robots" content="noindex"/);
assert.doesNotMatch(missingSlugBody, /<link\s+rel=["']canonical["']/);
assert.doesNotMatch(missingSlugBody, /<meta\s+property=["']og:url["']/);

const missingRouteRes = await fetch(`http://127.0.0.1:${fixedPort}/this-route-does-not-exist`, { headers: { "user-agent": chromeUa } });
assert.equal(missingRouteRes.status, 404);
const missingRouteBody = await missingRouteRes.text();
assert.match(missingRouteBody, /<h1>404 Page Not Found<\/h1>/);
assert.match(missingRouteBody, /Did you forget to add the page to the router\?/);
assert.match(missingRouteBody, /<meta name="robots" content="noindex"/);
assert.doesNotMatch(missingRouteBody, /<link\s+rel=["']canonical["']/);
assert.doesNotMatch(missingRouteBody, /<meta\s+property=["']og:url["']/);

for (const loc of sitemapUrls()) {
  const pathname = new URL(loc).pathname;
  const res = await fetch(`http://127.0.0.1:${fixedPort}${pathname}`, { headers: { "user-agent": chromeUa } });
  assert.equal(res.status, 200, `${pathname} should return 200`);
  const body = await res.text();
  assert.doesNotMatch(body, /<meta name="robots" content="noindex"/, pathname);
}
const validBlogRes = await fetch(`http://127.0.0.1:${fixedPort}/blog/fdd-red-flags`, { headers: { "user-agent": chromeUa } });
assert.equal(validBlogRes.status, 200);
assert.match(await validBlogRes.text(), /<link rel="canonical" href="https:\/\/www\.charlesstovall\.com\/blog\/fdd-red-flags"/);

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
assert.match(homeSeo, /href="\/mount-pleasant"/);
assert.match(homeSeo, /href="\/south-carolina"/);
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

const fddReadSeo = applySeoToHtml(shell, "/blog/how-i-read-an-fdd-in-20-minutes");
assert.match(fddReadSeo, /"@type":"BlogPosting"/);
assert.match(fddReadSeo, /"headline":"How I Actually Read an FDD in 20 Minutes"/);
assert.match(fddReadSeo, /"datePublished":"2026-09-21"/);
assert.match(fddReadSeo, /"mainEntityOfPage":"https:\/\/www\.charlesstovall\.com\/blog\/how-i-read-an-fdd-in-20-minutes"/);
assert.match(fddReadSeo, /How to read an FDD in 20 minutes/);
assert.match(fddReadSeo, /href="\/blog\/fdd-red-flags"/);
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

assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/mount-pleasant"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/south-carolina"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/about"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/faq"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/advisor"), true);
assert.equal(sitemapUrls().includes("https://www.charlesstovall.com/blog/how-i-read-an-fdd-in-20-minutes"), true);
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
assert.match(llmsBody, /\/mount-pleasant/);
assert.match(llmsBody, /\/south-carolina/);
assert.match(llmsBody, /\/executive-access/);
assert.match(llmsBody, /\/blog\/fdd-red-flags/);
assert.match(llmsBody, /\/blog\/how-i-read-an-fdd-in-20-minutes/);
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
await assertRedirect("/blog/this-post-does-not-exist/", "/blog/this-post-does-not-exist");
await assertRedirect("/this-route-does-not-exist/", "/this-route-does-not-exist");
await assertRedirect("/blog/fdd-red-flags/", "/blog/fdd-red-flags");
await new Promise<void>((resolve, reject) => redirectServer.close((err) => err ? reject(err) : resolve()));

assert.equal(NAP.addressLocality, "Mt Pleasant");
assert.equal(NAP.postalCode, "29466");

console.log("seo.test.ts passed");
