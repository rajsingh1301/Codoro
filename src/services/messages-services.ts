import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@/src/lib/dynamodb/client";
import { Message } from "@/src/types/message";

/**
 * Fetch latest 50 messages for a specific stream.
 */
export async function getLatestMessages(streamId: string, limit: number = 50): Promise<Message[]> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: "messages",
        KeyConditionExpression: "streamId = :streamId",
        ExpressionAttributeValues: {
          ":streamId": streamId,
        },
        ScanIndexForward: false, // Descending order (latest first)
        Limit: limit,
      })
    );

    const items = (result.Items as Message[]) || [];
    
    // Reverse items back to chronological order (oldest first)
    return items.reverse();
  } catch (error) {
    console.error("Failed to query messages from DynamoDB:", error);
    return [];
  }
}

/**
 * Save a message directly to DynamoDB.
 */
export async function saveMessageInDB(message: Message): Promise<void> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: "messages",
        Item: message,
      })
    );
    console.log(`[Message Service] Persisted message to DynamoDB: ${message.messageId}`);
  } catch (error) {
    console.error("Failed to persist message in DB:", error);
    throw error;
  }
}
