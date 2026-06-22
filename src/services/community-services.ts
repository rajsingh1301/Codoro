import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@/src/lib/dynamodb/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { communities as mockCommunities } from "@/src/lib/mock-data/communities";

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Create a new community in the database
export async function createCommunityInDB(data: {
  communityId: string;
  name: string;
  description: string;
  createdBy: string;
}) {
  await docClient.send(
    new PutCommand({
      TableName: "communities",
      Item: {
        ...data,
        createdAt: new Date().toISOString(),
      },
    }),
  );
}

// Get all communities from the database
export async function getCommunities() {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: "communities",
      })
    );
    return result.Items ?? [];
  } catch (error) {
    console.error("Failed to get communities from DB:", error);
    return [];
  }
}

// Get community by ID (with fallback to mock data)
export async function getCommunityById(communityId: string) {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: "communities",
        Key: {
          communityId,
        },
      })
    );

    if (result.Item) {
      return result.Item;
    }
  } catch (error) {
    console.error("Failed to get community from DB:", error);
  }

  // Fallback to mock data
  return mockCommunities.find((c) => c.communityId === communityId);
}
