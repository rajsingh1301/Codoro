import { NextResponse } from "next/server";
import { ListStreamsCommand } from "@aws-sdk/client-ivs";
import { ivsClient } from "@/src/lib/ivs/client";

export async function GET() {
  try {
    const result = await ivsClient.send(
      new ListStreamsCommand({})
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

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