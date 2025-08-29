import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "../../../../lib/models/mongodb";
import Group from "../../../../lib/models/TelegramGroup";

// GET /api/groups/:groupid
export async function GET(req: NextRequest, { params }: { params: { groupid: string } }) {
  await connectDB();

  const resolvedParams = await params;
  const groupIdStr = resolvedParams.groupid; // keep as string
  // console.log(groupIdStr);
  
  if (!groupIdStr) return NextResponse.json({ message: "Invalid groupid" }, { status: 400 });

const group = await Group.findOne({groupId:groupIdStr}); // no field restriction


console.log(group);

  
  if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

  return NextResponse.json(group);
}


// PUT /api/groups/:groupid
export async function PUT(req: NextRequest, { params }: { params: { groupid: string } }) {
  await connectDB();

  const resolvedParams = await params;
  const groupidNum = (resolvedParams.groupid).toString();

  
  const body = await req.json();
  // console.log(groupidNum,body)
  const {  welcomeMessage,
          goodbyeMessage,
          welcomeEnabled,
          goodbyeEnabled,
          spamProtection,
          wordFilters } = body;

  const updatedGroup = await Group.findOneAndUpdate(
    { groupId:groupidNum  },
    {  welcomeMessage ,
          goodbyeMessage,
          isWelcome : welcomeEnabled,
          isGoodbye : goodbyeEnabled,
          spam : spamProtection,
          bannedWords : wordFilters
         },
    { new: true }
  );
  console.log(groupidNum);
  
  if (!updatedGroup) return NextResponse.json({ message: "Group not found" }, { status: 404 });

  return NextResponse.json(updatedGroup);
}
