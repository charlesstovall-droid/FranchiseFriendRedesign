import { ensureHubspotProperties } from "../server/advisor/hubspot";

async function main() {
  const result = await ensureHubspotProperties();
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length && !result.created.length && !result.existing.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
