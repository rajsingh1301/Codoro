import { NextResponse } from "next/server";
import { getIVSStreamStatus } from "@/src/services/ivs-status-service";

export async function GET() {
  const status =
    await getIVSStreamStatus(
      "arn:aws:ivs:us-east-1:300107223848:channel/V0gFkkDslXoY"
    );

  return NextResponse.json({
    status,
  });
}