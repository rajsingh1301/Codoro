import { IvsClient } from "@aws-sdk/client-ivs";

export const ivsClient = new IvsClient({
  region: process.env.AWS_REGION || "us-east-1",

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
