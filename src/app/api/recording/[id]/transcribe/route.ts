import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const { id } = await params;

  const content = JSON.parse(body.content);

  const transcribed = await client.video.update({
    where: {
      userId: id,
      source: body.fileName,
    },
    data: {
      title: content.title,
      description: content.summary,
      summery: body.transcription,
    },
  });
  if (transcribed) {
    console.log("🟢 Transcribed");

    return NextResponse.json({ status: 200 });
  }
  console.log("🔴 Transcription went wrong");

  return NextResponse.json({ status: 400 });
}
