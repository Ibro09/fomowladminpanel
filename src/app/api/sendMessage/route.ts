import { NextResponse } from "next/server";
import { Markup, Telegraf,Input } from "telegraf";
import { connectDB } from "@/lib/models/mongodb";
import Group from "../../../lib/models/TelegramGroup";
import User from "../../../lib/models/User";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const inputPath = path.resolve("public/uploads/image.jpg");
const outputPath = path.resolve("public/uploads/image_compressed.jpg");

await sharp(inputPath)
  .resize({ width: 1280 }) // Resize width
  .jpeg({ quality: 80 })   // Compress quality
  .toFile(outputPath);



const bot = new Telegraf(process.env.BOT_TOKEN!);

export async function POST(req: Request) {
  await connectDB();
  const groups = await Group.find();
  const users = await User.find({}, { userId: 1, premium: 1 });
  const userMap = new Map(users.map((u) => [u.userId, u]));
  const nonPremiumGroups = groups.filter((g) => {
    const u = userMap.get(g.userId);
    return u && u.premium === false;
  });

  try {
  const { title, content, image, link, linkText } = await req.json();
   if (!content)
      return NextResponse.json({ error: "content required" }, { status: 400 });



for (const group of nonPremiumGroups) {
  try {
    if (image) {
   await bot.telegram.sendPhoto(
  group.groupId.toString(),
  { source: path.resolve("public/uploads/image.jpg") }, // or URL if hosted
  {
    caption: `<b>SPONSORED TEXT: ${title}</b>\n${content}\n\n`,
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [
        Markup.button.url(
          linkText || "View More",
          link || "https://t.me/latestrosebot?startgroup"
        ),
      ],
    ]),
  }
);

    }
else{
  await bot.telegram.sendMessage(
      group.groupId.toString(),
      `<b>SPONSORED TEXT:${title || "Hey there"}!</b>\n\n${content}\n\n` ,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.url(
              linkText || "➕ Add me to your chat!",
              link || "https://t.me/latestrosebot?startgroup"
            ),
          ],
        ]),
      }
    );  
}
    
  } catch (err: any) {
    console.error(`Error sending to ${group.groupId}:`, err?.description || err);
  }
}


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
