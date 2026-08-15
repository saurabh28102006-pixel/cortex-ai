import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const getFromS3=async (filename,expiresIn=600)=>{
  return await getSignedUrl(
    s3,
    new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || process.env.S3_BUCKET_NAME || "cortex-ai-agent-662182610213-ap-south-1-an",
        Key: filename
    }),
    { expiresIn }
  )
}