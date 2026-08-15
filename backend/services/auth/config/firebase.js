import { cert, initializeApp, getApps } from "firebase-admin/app";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

let credentialConfig = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    credentialConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch {
    credentialConfig = null;
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  try {
    credentialConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  } catch {
    credentialConfig = null;
  }
} else if (existsSync(serviceAccountPath)) {
  try {
    credentialConfig = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
  } catch {
    credentialConfig = null;
  }
}

let app;
if (getApps().length > 0) {
  app = getApps()[0];
} else if (credentialConfig && credentialConfig.projectId && credentialConfig.privateKey) {
  try {
    app = initializeApp({
      credential: cert(credentialConfig)
    });
  } catch (err) {
    console.error("Firebase Admin initialization error:", err.message);
    app = initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "cortex-fallback" });
  }
} else {
  console.warn("Firebase credentials not fully set, initializing with projectId fallback");
  app = initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "cortexai-36c87" });
}

export { app };
