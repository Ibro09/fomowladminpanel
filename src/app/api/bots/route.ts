// app/api/users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/models/mongodb";
import Bots from "../../../lib/models/Bots";

export async function GET() {
  await connectDB();
  const users = await Bots.find({});
  return NextResponse.json(users);
}
