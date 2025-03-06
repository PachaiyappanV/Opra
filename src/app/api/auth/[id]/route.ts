import { client } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log("Enpoint hit ✅");

  try {
    const userProfile = await client.user.findUnique({
      where: {
        clerkid: id,
      },
      include: {
        studio: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (userProfile) {
      return NextResponse.json({ status: 200, user: userProfile });
    }

    return NextResponse.json({ status: 400 });
  } catch (error) {
    return NextResponse.json({ status: 500 });
  }
}
