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
const DEFAULT_B64_KEY = "eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJvamVjdF9pZCI6ImNvcnRleGFpLTM2Yzg3IiwicHJpdmF0ZV9rZXlfaWQiOiI3ZTU1MzI3NzI4NmM5ZDAzNjBjMDExMjZhNTQzZDhlMWQwNWM4OGU3IiwicHJpdmF0ZV9rZXkiOiItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRREw3cTIxT2VDWnJkWnJcbm1IUUQ0M0puWlNTVHl2SVA2V1NVc2xSa3hEWkJUYVYxbWVWMmp1L1ZWTlFqMDB4RndLSUQ2R2xJWXJKM1RiM1lcbjNsZGJIZjVsd01qdHlwczAzbkNodURSR2FleEV2clZzeEJxY044bzBKYzFOSlRhYkNBanhJeFRRbm55U0NVMG5cbnEzUEdoUm0rRUhydEJVL1BTSDVJMlgyYk9EQjM5ckpLVGtoRzU5d2lRWDJ6UGlObzNpekFDUWthdzhjcGF0VXVcblhMd1ZmT2UvME5MUm9MTWdqT1NKcll0ZU03ZkpSQmJ6NVhmUHFscVNQWmFhRlY5T01CZVEzMU9hOHl2VWgySFNcbkhzdlJWWEY5dHF5b2MwdHNnWCtpYWMyYjBFZXAvUk85L01PUzFwRE9Hdnc4TlZEYThzdVowQjNYNERrblZzSzdcblZReW5ubG5mQWdNQkFBRUNnZ0VBRlJhTVhmWXJOSmtXV0MvK3B6eEk0MHBCT3dzOGRzckN2T0duK25lVHlMTDNcbnppNW8zUmF3MUZXZVRrb1dWQXcwZE1UK3hoNTJxQUdoQlNFUTFYcEhpVXdqT3Z1OWl2MEpscCtPd0UxSndsNGFcbk1ySWdzbERPbHcvbHAvbVdLUGZ1dk1qTTZUbktWZXVpVDl6Wjd3aHFmZzRFT0NoWmRXemdxalhiV0VhNk5GMWRcbjVBa2JMK29lQXBZb2l2aHB1QmRVRUZWNWJuaXYyZkZZbnVMOE9FQmJZVWJWK3RyOWZ4VzBneERiNDlEOFVyTmlcbnNIbHdieEd6M0JSekpaSXlKVzBhbHpFK0pWUkNIMkJIcUxrTU1FNlhQL3NMdjlaREsrUzFjRmtLMjJzdEcyNlFcbmYxNHFQeGtJWm42MEdSTDlocGFjY0xjTU0wNDM0YUlsekFud3V0SFY4UUtCZ1FENmQyTnFCQTg1eFlBY1Y1VXJcbnBQa3Z0WjY1Zk5iNmUzc0p6Q3dBb3RUdy95bHkrY0phNUhmZExKa05WY1dHdlRKZWJkQ0VBVzh2NlBkSkpBTWVcbkZMeHNCVGpsbmdxVnl2dFUxdXRxeVU1dnJFdEl3WFdmMCtNbmZLTGpCbzJnUVgyNktTbC9OT1BFck1NaFd2MjBcbm5Id3hFaEpxSnBsaG84UDJXNHFBakp5TGh3S0JnUURRY0JrL1Rjb1lBUnQzNTU0UUNRN3pUcnJIdmk0alJma1FcbjE3a0ZEK1FUMmw3TW04N0VwVWNGSkw1bnVHUHBYTVJyTkRnTWRBNjFWMEQzdjlVbFVyYTRRN0lEaEZEbk1RR3VcbklPazYrb3pTZ0p1ampxeEQ1ZnhrSHJ1VGZxSEo4djRNb3ZjK1Juck9RM011ZTkweFNCYzRtd2FJOUxCZ3JoR3Fcbjc3a2tUekRFNlFLQmdDMnpWd3BqRHp3bFUwalltamxLY3NWSHlGeGo4UDNuUmYzMXFSbThuRW9VNU1VNzJVQ29cbmEwNko4cXRDT1RacWt5UXp1Vlk4eE1MaktTdkpUR0JTdkVhaGRVNUFWZ0lhOVZ6M2tpRDc5am5lSUNaNFZqUUJcbmYzTVhCTW1UeW9leEszV3FTUTRTNG5SaWFZQk9qL2hDalU2TzA1bFd6YW5KTGRwbnZZL1RHRVZGQW9HQkFKQ1dcblFoMDBnOHkwNyszMEFDUVZkSVo0aFg1TFFVdjhuUEgvQW53dGNzUUd4WjNmTXNZYjlERHdOUmhUd3hLODVBK05cbmNKZks1ZTBLOHFrcEs5eXhETWl6Uk1mRndDMHZSSUFhbWs3c1FFVkJLeldBb2FTVDQ4azd2RmhyRGlXOVpsY3pcbnNKaEZZYWkxQnpBbWdlQk9wclVBYkw4U0pVdGJWQ3drRUdUTWZnTUpBb0dBREw2ajdaWkxvVWdXcHJ3Nno5SDNcblhjT3U0SHFUcDJpWnlNQlRCN2h2UVhVYS9hdUZSZUczY1R2R0tVSmZoWlJLYTV1U21zOFRoYjQ5VlU5Rkw3V0NcbjNDTGtZMnlVeDVYM28vM0g3RGhGVUIrQ0tPKytoVHVERDBWanQ5cUtJSDhUNmF3RFQ3MngvbTVpWEpZa1RHSGpcbnBxYTVtajJ0VTlKa1BrNDJlS1h0alRBPVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwiY2xpZW50X2VtYWlsIjoiZmlyZWJhc2UtYWRtaW5zZGstZmJzdmNAY29ydGV4YWktMzZjODcuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJjbGllbnRfaWQiOiIxMTgyOTEzNzY4ODc2MDA0MTk0NDQiLCJhdXRoX3VyaSI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwidG9rZW5fdXJpIjoiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLCJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLCJjbGllbnRfeDUwOV9jZXJ0X3VybCI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvZmlyZWJhc2UtYWRtaW5zZGstZmJzdmMlNDBjb3J0ZXhhaS0zNmM4Ny5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVuaXZlcnNlX2RvbWFpbiI6Imdvb2dsZWFwaXMuY29tIn0=";

if (!credentialConfig) {
  try {
    const jsonStr = Buffer.from(DEFAULT_B64_KEY, "base64").toString("utf-8");
    credentialConfig = JSON.parse(jsonStr);
  } catch {
    credentialConfig = null;
  }
}

let app;
if (getApps().length > 0) {
  app = getApps()[0];
} else if (credentialConfig && (credentialConfig.projectId || credentialConfig.project_id)) {
  try {
    app = initializeApp({
      credential: cert(credentialConfig)
    });
  } catch (err) {
    console.error("Firebase Admin initialization error:", err.message);
    app = initializeApp({ projectId: "cortexai-36c87" });
  }
} else {
  console.warn("Firebase credentials not fully set, initializing with projectId fallback");
  app = initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || "cortexai-36c87" });
}

export { app };
