console.log("TEST STARTED");

import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log("KEY EXISTS:", !!process.env.AWS_ACCESS_KEY_ID);
console.log("SECRET EXISTS:", !!process.env.AWS_SECRET_ACCESS_KEY);

async function main() {
  try {
    const client = new STSClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const result = await client.send(
      new GetCallerIdentityCommand({})
    );

    console.log("SUCCESS");
    console.log(result);
  } catch (err) {
    console.error("ERROR");
    console.error(err);
  }
}

main();