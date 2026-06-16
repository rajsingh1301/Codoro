import { NextResponse } from "next/server";
import { askAI } from "@/src/services/ai-services";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const response = await askAI(question);

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to get AI response",
      },
      {
        status: 500,
      }
    );
  }
}