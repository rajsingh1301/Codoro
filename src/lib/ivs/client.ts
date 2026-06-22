import { IvsClient } from "@aws-sdk/client-ivs";

console.log(
  "IVS KEY:",

  process.env.AWS_ACCESS_KEY_ID,
);

console.log(
  "IVS SECRET LENGTH:",

  process.env.AWS_SECRET_ACCESS_KEY?.length,
);

console.log(
  "IVS REGION:",

  process.env.AWS_REGION,
);
export const ivsClient = new IvsClient({
  region: process.env.AWS_REGION || "us-east-1",

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
