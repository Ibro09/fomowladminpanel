"use client";
import { useEffect, useState } from "react";
import { ServerSelector } from "@/components/ServerSelector";
import { ModerationTools } from "@/components/ModerationTools";
import { DiscordModerationTools } from "@/components/DiscordModerationTools";
import { ModerationLogs } from "@/components/ModerationLogs";
import {
  Filter,
  HelpCircle,
  List,
  MessageSquare,
  Minus,
  Plus,
  Settings,
  Shield,
  UserMinus,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "next/font/google";
import { Separator } from "@radix-ui/react-select";
import Sidebar from "@/components/Sidebar";
import { withAuth } from "../withAuth";

const Index = () => {
  const [selectedServer, setSelectedServer] = useState("1");


  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-background ml-o md:ml-[50px]">
        <div className="max-w-[1200px] mx-auto p-[24px] space-y-[24px]">
          {/* Header */}
          <div className="text-center py-[32px]">
            <div className="flex items-center justify-center gap-[12px] mb-[8px]">
              <Shield className="w-[32px] h-[32px] text-[white]" />
              <h1 className="text-[32px] font-bold text-[white]">
                Moderation Dashboard
              </h1>
            </div>
            <p className="text-[16px] text-muted-foreground">
              Manage your community settings and monitor moderation activities
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            {/* Moderation Tools */}
            <div className="space-y-[24px]">
              <ModerationTools />
            </div>
            <div className="space-y-[24px]">
              <DiscordModerationTools />
            </div>
           
          </div>
           {/* Moderation Logs */}
            <div className="space-y-[24px]">
              <Card className="bg-[#171717] border-none shadow-lg text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-[#dd4870]" />
                    <span>Bot Commands</span>
                  </CardTitle>
                  <CardDescription>
                    Quick access to all bot moderation commands
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Commands */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
                      <HelpCircle className="h-4 w-4 text-[#dd4870]" />
                      <span>Basic Commands</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" className="justify-start bg-black ">
                        {/* <Play className="h-4 w-4 mr-2" /> */}
                        /start
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        /help
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Welcome & Goodbye Messages */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-[#dd4870]" />
                      <span>Welcome & Goodbye</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border-none">
                      <Button size="sm" className="justify-start bg-black">
                        <Plus className="h-4 w-4 mr-2" />
                        /setwelcome
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <Settings className="h-4 w-4 mr-2" />
                        /togglewelcome
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <Minus className="h-4 w-4 mr-2" />
                        /removewelcome
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <Plus className="h-4 w-4 mr-2" />
                        /setgoodbye
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <Settings className="h-4 w-4 mr-2" />
                        /togglegoodbye
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <Minus className="h-4 w-4 mr-2" />
                        /removegoodbye
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* User Moderation */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
                      <UserMinus className="h-4 w-4 text-[#dd4870]" />
                      <span>User Moderation</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        className="justify-start bg-black  text-destructive border-destructive/20 hover:bg-destructive/10"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        /ban
                      </Button>
                      <Button
                        size="sm"
                        className="justify-start bg-black  text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10"
                      >
                        <VolumeX className="h-4 w-4 mr-2" />
                        /mute
                      </Button>
                      <Button
                        size="sm"
                        className="justify-start bg-black  text-green-500 border-green-500/20 hover:bg-green-500/10"
                      >
                        <Volume2 className="h-4 w-4 mr-2" />
                        /unmute
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Word Filter Commands */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-[#dd4870]" />
                      <span>Word Filtering</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <Button size="sm" className="justify-start bg-black ">
                        <Plus className="h-4 w-4 mr-2" />
                        /addfilter
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <Minus className="h-4 w-4 mr-2" />
                        /removefilter
                      </Button>
                      <Button size="sm" className="justify-start bg-black ">
                        <List className="h-4 w-4 mr-2" />
                        /listfilters
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Spam Protection */}
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-[#dd4870]" />
                      <span>Spam Protection</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button size="sm" className="justify-start bg-black ">
                        <Zap className="h-4 w-4 mr-2" />
                        /spam
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>{" "}
            </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Index);
