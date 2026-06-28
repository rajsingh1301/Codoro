import { GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/src/lib/dynamodb/client";
import { randomUUID } from "crypto";
import { createIVSChannel, deleteIVSChannel } from "@/src/services/ivs-services";

// Create a new stream in the database
export async function createStreamInDB(data: {
  title: string;
  description: string;
  communityId: string;
  creatorId: string;
  creatorName: string;
  creatorImage: string;
}) {
  const streamId = randomUUID();

  const ivs = await createIVSChannel(data.title);

  console.log("IVS CHANNEL CREATED:", ivs);
  await docClient.send(
    new PutCommand({
      TableName: "streams",
      Item: {
        streamId,
        title: data.title,
        description: data.description,
        communityId: data.communityId,
        creatorId: data.creatorId,
        creatorName: data.creatorName,
        creatorImage: data.creatorImage,
        status: "OFFLINE",
        channelArn: ivs.channelArn,
        playbackUrl: ivs.playbackUrl,
        streamKey: ivs.streamKey,
        viewCount: 0,
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
  console.log("Fetching stream:", streamId);

  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: "streams",

        Key: {
          streamId,
        },
      }),
    );

    console.log("RESULT:", result);

    return result.Item;
  } catch (error) {
    console.error("GET STREAM ERROR:", error);

    throw error;
  }
}
// Update the status of a stream in the database
export async function updateStreamStatus(
  streamId: string,

  status: "LIVE" | "OFFLINE" | "ENDED",
) {
  await docClient.send(
    new UpdateCommand({
      TableName: "streams",

      Key: {
        streamId,
      },

      UpdateExpression: "SET #status = :status",

      ExpressionAttributeNames: {
        "#status": "status",
      },

      ExpressionAttributeValues: {
        ":status": status,
      },
    }),
  );
}

// Get all streams from the database
export async function getAllStreams() {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: "streams",
      }),
    );
    return result.Items || [];
  } catch (error) {
    console.error("GET ALL STREAMS ERROR:", error);
    return [];
  }
}

export async function deleteStream(streamId: string) {
  const stream = await getStreamById(streamId);
  if (!stream) {
    throw new Error("Stream not found");
  }

  // Clean up AWS IVS channel if associated
  if (stream.channelArn) {
    console.log("Cleaning up associated IVS Channel:", stream.channelArn);
    await deleteIVSChannel(stream.channelArn);
  }

  // Delete from DynamoDB
  console.log("Deleting stream from DynamoDB streams table:", streamId);
  await docClient.send(
    new DeleteCommand({
      TableName: "streams",
      Key: {
        streamId,
      },
    })
  );
}

