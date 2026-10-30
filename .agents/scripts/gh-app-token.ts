// Prints a 1-hour installation token for the edc-review GitHub App.
// Usage: GH_TOKEN=$(bun .agents/scripts/gh-app-token.ts) gh api ...
// Reads ~/.config/edc-review/config.json (clientId, installationId) and key.pem. Never commit either file.
import { createSign } from "node:crypto";
import { homedir } from "node:os";

const dir = `${homedir()}/.config/edc-review`;
const config = await Bun.file(`${dir}/config.json`).json();
const key = await Bun.file(`${dir}/key.pem`).text();

const b64url = (value: string) => Buffer.from(value).toString("base64url");
const now = Math.floor(Date.now() / 1000);
// GitHub: iat 60 s in the past (clock drift), exp at most 10 min ahead, iss = Client ID.
const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const payload = b64url(JSON.stringify({ iat: now - 60, exp: now + 540, iss: config.clientId }));
const signature = createSign("RSA-SHA256").update(`${header}.${payload}`).sign(key).toString("base64url");

const response = await fetch(
  `https://api.github.com/app/installations/${config.installationId}/access_tokens`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${header}.${payload}.${signature}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);
if (!response.ok) {
  console.error(`token request failed: ${response.status} ${await response.text()}`);
  process.exit(1);
}
console.log((await response.json()).token);
