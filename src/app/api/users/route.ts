// app/api/users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/models/mongodb";
import User from "../../../lib/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find({});
  return NextResponse.json(users);
}
