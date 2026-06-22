import { NextResponse } from "next/server";
import { ListChannelsCommand } from "@aws-sdk/client-ivs";
import { ivsClient } from "@/src/lib/ivs/client";

export async function GET() {
  try {
    const result = await ivsClient.send(
      new ListChannelsCommand({})
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("LIST CHANNELS ERROR:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}