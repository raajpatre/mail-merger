import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const envExamplePath = path.join(root, ".env.example");
const envLocalPath = path.join(root, ".env.local");

if (!existsSync(envExamplePath)) {
  console.error("Missing .env.example");
  process.exit(1);
}

if (!existsSync(envLocalPath)) {
  copyFileSync(envExamplePath, envLocalPath);
}

const envContents = readFileSync(envLocalPath, "utf8");

const generatedSecret = randomBytes(32).toString("base64");

const nextContents = envContents.replace(
  /NEXTAUTH_SECRET=.*/g,
  `NEXTAUTH_SECRET=${generatedSecret}`
);

writeFileSync(envLocalPath, nextContents, "utf8");

console.log("Updated .env.local");
console.log("Next step: fill in GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
