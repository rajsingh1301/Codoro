import { NextResponse } from "next/server";
import { getStreamById } from "@/src/services/streams-services";
import { getIVSStreamStatus } from "@/src/services/ivs-status-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ streamId: string }> }
) {
  const { streamId } = await params;

  const stream = await getStreamById(streamId);

  if (!stream) {
    return NextResponse.json(
      { error: "Stream not found" },
      { status: 404 }
    );
  }

  const status = await getIVSStreamStatus(
    stream.channelArn
  );

  return NextResponse.json({
    status,
  });
}