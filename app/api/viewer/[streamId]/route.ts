import { NextResponse } from "next/server";
import { incrementViewerCount } from "@/src/services/viewer-services";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ streamId: string }>;
  }
) {
  const { streamId } = await params;

  await incrementViewerCount(streamId);

  return NextResponse.json({
    success: true,
  });
}