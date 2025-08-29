import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/models/mongodb";
import Group from "../../../../lib/models/TelegramGroup";

export async function GET(
  req: NextRequest,
  context: any   // 👈 instead of { params: { groupid: string } }
) {
  const { groupid } = context.params;
  await connectDB();
  const groupIdStr = groupid;

  if (!groupIdStr) {
    return NextResponse.json({ message: "Invalid groupid" }, { status: 400 });
  }

  const group = await Group.findOne({ groupId: groupIdStr });
  if (!group) {
    return NextResponse.json({ message: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function Put(
  req: NextRequest,
  context: any   // 👈 instead of { params: { groupid: string } }
) {
  const { groupid } = context.params;
  await connectDB();
  const groupidNum = groupid;

  const body = await req.json();
  const {
    welcomeMessage,
    goodbyeMessage,
    welcomeEnabled,
    goodbyeEnabled,
    spamProtection,
    wordFilters,
  } = body;

  const updatedGroup = await Group.findOneAndUpdate(
    { groupId: groupidNum },
    {
      welcomeMessage,
      goodbyeMessage,
      isWelcome: welcomeEnabled,
      isGoodbye: goodbyeEnabled,
      spam: spamProtection,
      bannedWords: wordFilters,
    },
    { new: true }
  );

  if (!updatedGroup) {
    return NextResponse.json({ message: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(updatedGroup);
}
