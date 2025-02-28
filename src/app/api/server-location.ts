import { NextResponse } from "next/server";

export default async function GET(req, res) {
  return NextResponse.json({ region: process.env.VERCEL_REGION || "Unknown" });
}
