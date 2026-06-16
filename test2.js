import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
console.log("STS test started");
const clientConfig = {
  region: "us-east-1",
};

// Only pass credentials if they are defined in env, otherwise fallback to local AWS profile
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const client = new STSClient(clientConfig);

try {
  const result = await client.send(new GetCallerIdentityCommand({}));
  console.log("Success:", result);
} catch (error) {
  console.error("STS Error:", error);
}
