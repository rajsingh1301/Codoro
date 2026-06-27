import { NextRequest, NextResponse } from "next/server";
import { getLatestMessages } from "@/src/services/messages-services";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const streamId = searchParams.get("streamId");

  if (!streamId) {
    return NextResponse.json({ error: "Missing streamId" }, { status: 400 });
  }

  try {
    const messages = await getLatestMessages(streamId);
    return NextResponse.json({ data: messages });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    message: "POST /api/messages - Post chat message placeholder (handled via WebSockets)"
  }, { status: 201 });
}
