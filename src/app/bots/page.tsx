"use client";
import { useEffect, useState } from "react";
import { withAuth } from "../withAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  SortAsc,
  Eye,
  Pause,
  Play,
  Trash2,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";

// Types and Interfaces
interface Bot {
  id: string;
  name: string;
  creator: string;
  createdAt: string;
  status: "active" | "suspended";
  platform: string;
  token: string;
  usageStats: {
    users: number;
    groups: number;
    messages: number;
  };
  logs: Array<{
    timestamp: string;
    action: string;
    status: "success" | "error";
  }>;
}
// Types and Interfaces
// Types and Interfaces
interface  NewBot {
  _id:string,
  ownerId: number;       // The Telegram user ID of the bot owner
  botId: number;         // The unique bot ID
  username: string;      // The bot's username (unique)
  token: string;         // The bot token (unique)
  description?: string;  // Optional description (defaults to empty string)
  createdAt?: Date;      // Optional creation date (defaults to Date.now)
}

// Mock Data
const mockBots: Bot[] = [
  {
    id: "bot_001",
    name: "CustomerSupportBot",
    creator: "john.doe@company.com",
    createdAt: "2024-01-15T10:30:00Z",
    status: "active",
    platform: "Telegram",
    token: "1234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw",
    usageStats: {
      users: 1247,
      groups: 23,
      messages: 8945,
    },
    logs: [
      {
        timestamp: "2024-01-20T14:30:00Z",
        action: "Message processed successfully",
        status: "success",
      },
      {
        timestamp: "2024-01-20T14:25:00Z",
        action: "Bot started",
        status: "success",
      },
      {
        timestamp: "2024-01-20T12:15:00Z",
        action: "Connection timeout",
        status: "error",
      },
    ],
  },
  {
    id: "bot_002",
    name: "NewsBot",
    creator: "sarah.wilson@news.com",
    createdAt: "2024-01-18T09:15:00Z",
    status: "suspended",
    platform: "Discord",
    token: "9876543210:BBIdqTcvCH1vGWJxfSeofSAs0K5PALDsaw",
    usageStats: {
      users: 892,
      groups: 15,
      messages: 5632,
    },
    logs: [
      {
        timestamp: "2024-01-19T16:45:00Z",
        action: "Bot suspended by admin",
        status: "success",
      },
      {
        timestamp: "2024-01-19T16:40:00Z",
        action: "Rate limit exceeded",
        status: "error",
      },
    ],
  },
  {
    id: "bot_003",
    name: "GameStatsBot",
    creator: "mike.johnson@gaming.io",
    createdAt: "2024-01-20T11:20:00Z",
    status: "active",
    platform: "Slack",
    token: "5555666677:CCJdqTcvCH1vGWJxfSeofSAs0K5PALDsaw",
    usageStats: {
      users: 456,
      groups: 8,
      messages: 2134,
    },
    logs: [
      {
        timestamp: "2024-01-20T15:10:00Z",
        action: "Stats updated successfully",
        status: "success",
      },
      {
        timestamp: "2024-01-20T15:05:00Z",
        action: "API call successful",
        status: "success",
      },
    ],
  },
  {
    id: "bot_004",
    name: "WeatherBot",
    creator: "emily.davis@weather.app",
    createdAt: "2024-01-19T14:45:00Z",
    status: "active",
    platform: "Telegram",
    token: "7777888899:DDKdqTcvCH1vGWJxfSeofSAs0K5PALDsaw",
    usageStats: {
      users: 2341,
      groups: 45,
      messages: 12678,
    },
    logs: [
      {
        timestamp: "2024-01-20T15:20:00Z",
        action: "Weather data fetched",
        status: "success",
      },
    ],
  },
  {
    id: "bot_005",
    name: "EventBot",
    creator: "alex.brown@events.co",
    createdAt: "2024-01-17T08:30:00Z",
    status: "suspended",
    platform: "Discord",
    token: "1111222233:EELdqTcvCH1vGWJxfSeofSAs0K5PALDsaw",
    usageStats: {
      users: 678,
      groups: 12,
      messages: 3456,
    },
    logs: [
      {
        timestamp: "2024-01-18T10:30:00Z",
        action: "Spam detection triggered",
        status: "error",
      },
    ],
  },
];

// BotStatusBadge Component
const BotStatusBadge = ({
  status,
  className,
}: {
  status: "active" | "suspended";
  className?: string;
}) => {
  return (
    <Badge
      className={cn(
        "text-[12px] font-medium px-2 py-1 rounded-full border-0",
        status === "active"
          ? "bg-[#16a24935] text-[#16a249ff]"
          : "bg-[#ef43433b] text-[#ef4343ff]",
        className
      )}
    >
      {status === "active" ? "Active" : "Suspended"}
    </Badge>
  );
};

// BotActionButtons Component
const BotActionButtons = ({
  botId,
  status,
  onView,
  onToggleStatus,
  onDelete,
}: {
  botId: string;
  status: "active" | "suspended";
  onView: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onView(botId)}
        className="h-8 w-8 p-0 hover:bg-[#171717]-hover text-[white]/50 hover:text-white"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onToggleStatus(botId)}
        className={cn(
          "h-8 w-8 p-0 hover:bg-[#171717]-hover",
          status === "active"
            ? "text-[#ef4343ff] hover:text-[#ef43433b]"
            : "text-[#16a249ff] hover:[#16a24935]"
        )}
      >
        {status === "active" ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDelete(botId)}
        className="h-8 w-8 p-0 hover:bg-[#171717]-hover text-[#ef4343ff] hover:text-[#ef43433b]"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// BotDetailsModal Component
const BotDetailsModal = ({
  isOpen,
  onClose,
  bot,
}: {
  isOpen: boolean;
  onClose: () => void;
  bot: Bot | null;
}) => {
  const [showToken, setShowToken] = useState(false);

  if (!bot) return null;

  const maskedToken =
    bot.token.replace(/./g, "*").slice(0, -4) + bot.token.slice(-4);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-[#171717] text-white w-[90%] border border-[red]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Bot Details: {bot.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card className="bg-admin-bg ">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-[white]/50 text-sm">Bot ID</span>
                <p className="text-white font-mono">{bot.id}</p>
              </div>
              <div>
                <span className="text-[white]/50 text-sm">Creator</span>
                <p className="text-white">{bot.creator}</p>
              </div>
              <div>
                <span className="text-[white]/50 text-sm">Platform</span>
                <Badge className="bg-primary text-white ml-2">
                  {bot.platform}
                </Badge>
              </div>
              <div>
                <span className="text-[white]/50 text-sm">Status</span>
                <div className="mt-1">
                  <BotStatusBadge status={bot.status} />
                </div>
              </div>
              <div>
                <span className="text-[white]/50 text-sm">Created</span>
                <p className="">{bot.createdAt}</p>
              </div>
            </CardContent>
          </Card>

          {/* Token & Security */}
          <Card className="bg-admin-bg ">
            <CardHeader>
              <CardTitle className="text-white text-lg">
                Token & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-[white]/50 text-sm">Bot Token</span>
                <div className="flex items-center gap-2 mt-1 w-[90%]  flex-wrap border border-[red]">
                  <code className="bg-[#171717] px-2 py-1 rounded text-white font-mono text-sm flex-1 ">
                    {showToken ? bot.token : maskedToken}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowToken(!showToken)}
                    className="h-8 w-8 p-0 hover:bg-[#171717]-hover text-[white]/50"
                  >
                    {showToken ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className=" hover:bg-[#171717]-hover text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Token
                </Button>
              </div>
            </CardContent>
          </Card>

        
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t ">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={
                bot.status === "active"
                  ? "border-status-suspended text-status-suspended hover:bg-status-suspended-bg"
                  : "border-status-active text-status-active hover:bg-status-active-bg"
              }
            >
              {bot.status === "active" ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Suspend Bot
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate Bot
                </>
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-action-danger text-action-danger hover:bg-action-danger hover:text-[white]"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Bot
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Index = () => {
  const [bots, setBots] = useState<Bot[]>(mockBots);
  const [newBots, setNewBots] = useState<NewBot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredBots = newBots.filter((bot) => {
    const matchesSearch =
      bot.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.ownerId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.botId.toString().toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch ;
  });

  const handleViewBot = (botId: string) => {
    const bot = newBots.find((b) => b._id === botId);
    if (bot) {
      setSelectedBot(bot);
      setIsModalOpen(true);
    }
  };

  const handleToggleStatus = (botId: string) => {
    setBots((prev) =>
      prev.map((bot) =>
        bot.id === botId
          ? { ...bot, status: bot.status === "active" ? "suspended" : "active" }
          : bot
      )
    );

    const bot = bots.find((b) => b.id === botId);
    const newStatus = bot?.status === "active" ? "suspended" : "active";

    toast({
      title: "Status Updated",
      description: `Bot ${bot?.name} has been ${newStatus}.`,
    });
  };

  const handleDeleteBot = (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    setBots((prev) => prev.filter((b) => b.id !== botId));

    toast({
      title: "Bot Deleted",
      description: `Bot ${bot?.name} has been permanently deleted.`,
      variant: "destructive",
    });
  };

  const platforms = Array.from(new Set(mockBots.map((bot) => bot.platform)));

  useEffect(() => {
    async function fetchData() {
      try {
        const [ discordBotsRes] = await Promise.all([
          fetch("/api/bots"),
        ]);

        const [ botsData]: [NewBot[]] = await Promise.all([
          discordBotsRes.json(),
        ]);

       console.log(botsData);
       setNewBots(botsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);


  return (
    <>
    <Sidebar/>
      <div className="min-h-screen bg-black text-white p-6 ml-0 md:ml-[50px]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Bot Creator Management
              </h1>
              <p className="text-[white]/50 mt-1">
                Manage all bots created by users
              </p>
            </div>
          
          </div>

          {/* Search and Filters */}
          <Card className="bg-[#171717]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[white]/50 h-4 w-4" />
                  <Input
                    placeholder="Search by bot name, creator, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black text-white placeholder:text-[white]/50 focus:border-none border-none"
                  />
                </div>

                <div className="flex gap-2 border-none outline-none">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-black  text-white border-none focus:outline-none">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#171717] ">
                      <SelectItem value="all" className="text-white">
                        All Status
                      </SelectItem>
                      <SelectItem value="active" className="text-white">
                        Active
                      </SelectItem>
                      <SelectItem value="suspended" className="text-white">
                        Suspended
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={platformFilter}
                    onValueChange={setPlatformFilter}
                  >
                    <SelectTrigger className="w-[140px] bg-admin-bg  text-white">
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#171717] ">
                      <SelectItem value="all" className="text-white">
                        All Platforms
                      </SelectItem>
                      {platforms.map((platform) => (
                        <SelectItem
                          key={platform}
                          value={platform}
                          className="text-white"
                        >
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Table */}
          <Card className="bg-[#171717] ">
            <CardHeader>
              <CardTitle className="text-white">
                Bots List ({filteredBots.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-10">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className=" hover:bg-[#171717]-hover">
                      <TableHead className="text-[white]/50">
                        Bot ID / Name
                      </TableHead>
                      <TableHead className="text-[white]/50">Creator</TableHead>
                      <TableHead className="text-[white]/50">
                        Date Created
                      </TableHead>
                      <TableHead className="text-[white]/50">Status</TableHead>
                      <TableHead className="text-[white]/50">
                        Platform
                      </TableHead>
                      <TableHead className="text-[white]/50">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBots.map((bot) => (
                      <TableRow
                        key={bot._id}
                        className=" hover:bg-[#171717]-hover"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{bot.username}</p>
                            <p className="text-[10px] text-[white]/50 font-mono pt-2">
                              {bot._id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">
                          {bot.ownerId}
                        </TableCell>
                        <TableCell className="text-[white]/50">
                          {bot.createdAt?.toString().slice(0,10)}
                        </TableCell>
                        <TableCell>
                          <BotStatusBadge status={'active'} />
                        </TableCell>
                        <TableCell>
                          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                            {bot.ownerId}
                          </span>
                        </TableCell>
                        <TableCell>
                          <BotActionButtons
                            botId={(bot._id).toString()}
                            status={'active'}
                            onView={handleViewBot}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDeleteBot}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredBots.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[white]/50">
                    No bots found matching your criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bot Details Modal */}
        <BotDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bot={selectedBot}
        />
      </div>
    </>
  );
};

export default withAuth(Index);
