import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const region = process.env.AWS_REGION || "us-east-1";

const clientConfig: Record<string, any> = {
  region,
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

export const dynamoClient = new DynamoDBClient(clientConfig);

