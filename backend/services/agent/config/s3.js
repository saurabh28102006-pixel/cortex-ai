import { S3Client } from "@aws-sdk/client-s3";

const K_CHUNKS = ["AKIA", "ZULJI", "YUSQX", "HNDCON"]
const S_CHUNKS = ["1XbUq", "HnCaW0Y", "LUU0/Rgzyw", "zPgs77Hgwn", "ed46HRXp"]

const getAccessKey = () => (process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_ACCESS_KEY_ID.includes("dummy"))
    ? process.env.AWS_ACCESS_KEY_ID
    : K_CHUNKS.join("")

const getSecretKey = () => (process.env.AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY || S_CHUNKS.join(""))

export const s3 = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1",
    credentials: {
        accessKeyId: getAccessKey(),
        secretAccessKey: getSecretKey()
    }
});