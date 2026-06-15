import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/src/lib/dynamodb/client";
import { randomUUID } from "crypto";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create a new stream in the database
export async function createStreamInDB(data: {
  title: string;
  description: string;
  communityId: string;
}) {
  const streamId = randomUUID();

  await docClient.send(
    new PutCommand({
      TableName: "streams",
      Item: {
        streamId,
        title: data.title,
        description: data.description,
        communityId: data.communityId,

        creatorId: "temp-user",
        creatorName: "Mayank",

        status: "OFFLINE",

        createdAt: new Date().toISOString(),
      },
    }),
  );

  return streamId;
}
// Get all streams for a specific community from the database
export async function getStreamsByCommunityId(communityId: string) {
  const result = await docClient.send(
    new ScanCommand({
      TableName: "streams",
    }),
  );

  return (
    result.Items?.filter((stream) => stream.communityId === communityId) || []
  );
}

// Get a stream by its ID from the database
export async function getStreamById(streamId: string) {
  const result = await docClient.send(
    new GetCommand({
      TableName: "streams",

      Key: {
        streamId,
      },
    }),
  );

  return result.Item;
}