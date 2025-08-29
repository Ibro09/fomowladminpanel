"use client";
import { withAuth } from "../withAuth";
import { useState } from "react";
import { Calendar, Upload } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import https from "https";
import { log } from "util";

function AdsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [linkText, setLinkText] = useState("");

  const [ads] = useState([
    {
      id: "AD001",
      title: "Summer Sale Campaign",
      platform: ["TG", "DC"],
      status: "Paused",
      creator: "John Smith",
      created: "2024-01-15",
    },
  ]);

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setImage(URL.createObjectURL(file)); // Preview

  const formData = new FormData();
  formData.append("image", file);

  await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
};




const handleAds = async () => {
  if (!title || !content || !linkText) {
    alert("All fields (title, content, linkText) are required");
    return;
  }

  // Validate link format
  try {
    new URL(link);
  } catch {
    alert("Invalid link format (must start with http:// or https://)");
    return;
  }

  // Check if website is online
  const res = await fetch("/api/checkLink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ link }),
  });

  const { online } = (await res.json()) as { online: boolean };

  if (!online) {
    alert("The website is not reachable.");
    return;
  }

  // Proceed with sending the message
  await fetch("/api/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, image, link, linkText }),
  }).then((res) => alert("Ad campaign created successfully!"));
};


  return (
    <>
      <Sidebar />
      <div className="p-6 bg-black min-h-screen text-white ml-[50px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Ads Management Dashboard</h1>
            <p className="text-gray-500">
              Create and manage your advertising campaigns
            </p>
          </div>
         
        </div>

        {/* Create Ad + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 ">
          {/* Create New Ad */}
          <div className="bg-[#171717] rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Ad</h2>
            <input
              type="text"
              placeholder="Enter ad title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 px-4 py-2  rounded-md bg-black"
            />
            <textarea
              placeholder="Write your ad content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mb-4 px-4 py-2  rounded-md bg-black h-28"
            />

            {/* Image Upload */}
            <label className="border-1 border-dashed border-[white]/50 rounded-md p-6 flex flex-col items-center justify-center text-gray-500 cursor-pointer mb-6">
              <Upload className="w-6 h-6 mb-2" />
              <span>Image Upload (Optional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

           <h2 className="text-lg font-semibold mb-4">Ads link</h2>
            <input
              type="text"
              placeholder="Enter ad link..." 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full mb-4 px-4 py-2  rounded-md bg-black"
            />
           <h2 className="text-lg font-semibold mb-4">link text</h2>
            <input
              type="text"
              placeholder="Enter ad title..."
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="w-full mb-4 px-4 py-2  rounded-md bg-black"
            />

            <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-md font-medium" onClick={()=>handleAds()}>
              Create Ad Campaign
            </button>
          </div>

          {/* Live Preview */}
          <div className="bg-[#171717] rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>

            {/* Telegram Style Preview */}
            <div className="mb-6">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                Telegram Preview
              </p>
              <div className="bg-gray-800 rounded-lg  mt-2 max-w-sm pt-3">
                <p className="text-blue-300  px-3 text-sm max-w-full  h-auto break-words whitespace-normal">
                  Fomowl bot
                </p>
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-md mt-2"
                  />
                )}
                <p className="font-semibold text-white px-3 max-w-full h-auto break-words whitespace-normal mt-2">
                  SPONSORED TEXT: {title || "Ad Title"}
                </p>
                <p className="text-gray-300 text-sm px-3 max-w-full h-auto break-words whitespace-normal">
                  {content || "Your ad content goes here..."}
                </p>
                <p className="text-gray-300 text-sm px-3 max-w-full  h-auto break-words whitespace-normal  mt-3 p-3 rounded-b-md text-center border-t border-gray-600">
                  {linkText || "Clickable text that redirects to link"}
                </p>
              </div>
            </div>

            {/* Discord Style Preview */}
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>{" "}
                Discord Preview
              </p>
              <div className="bg-gray-900 border-l-4 border-indigo-500 rounded-lg p-3 mt-2 max-w-sm">
                <p className="font-semibold text-indigo-400 max-w-full  h-auto break-words whitespace-normal">
                   SPONSORED TEXT: {title || "Ad Title"}
                </p>
                <p className="text-gray-300 text-sm max-w-full  h-auto break-words whitespace-normal">
                  {content || "Your ad content goes here..."}
                </p>
                {image && (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-md mt-2"
                  />
                )}
              
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </>
  );
}
export default withAuth(AdsPage);
