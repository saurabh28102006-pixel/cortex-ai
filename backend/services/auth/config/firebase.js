import { cert, initializeApp } from "firebase-admin/app";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

let credentialConfig;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    credentialConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch {
    credentialConfig = null;
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  credentialConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  };
} else if (existsSync(serviceAccountPath)) {
  credentialConfig = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
}

export const app = initializeApp({
  credential: cert(credentialConfig)
});
