import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, MessageCircle, Shield, Users, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModerationSettings {
  welcomeMessage: string;
  goodbyeMessage: string;
  welcomeEnabled: boolean;
  goodbyeEnabled: boolean;
  spamProtection: boolean;
  wordFilters: string[];
}

export const DiscordModerationTools = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ModerationSettings>({
    welcomeMessage:
      "Welcome to our community! Please read the rules and enjoy your stay.",
    goodbyeMessage: "Thanks for being part of our community. We'll miss you!",
    welcomeEnabled: true,
    goodbyeEnabled: false,
    spamProtection: true,
    wordFilters: [],
  });
  const [newFilter, setNewFilter] = useState("");
  const welcomeText =
    "Note: use {username} to mention the user or {name} to mention user's name";
  const handleSaveMessage = (type: "welcome" | "goodbye") => {
    toast({
      title: "Message Updated",
      description: `${
        type === "welcome" ? "Welcome" : "Goodbye"
      } message has been saved successfully.`,
      duration: 3000,
    });
  };

  const handleAddFilter = () => {
    if (newFilter.trim() && !settings.wordFilters.includes(newFilter.trim())) {
      setSettings((prev) => ({
        ...prev,
        wordFilters: [...prev.wordFilters, newFilter.trim()],
      }));
      setNewFilter("");
      toast({
        title: "Filter Added",
        description: `Word filter "${newFilter.trim()}" has been added.`,
        duration: 3000,
      });
    }
  };

  const handleRemoveFilter = (filterToRemove: string) => {
    setSettings((prev) => ({
      ...prev,
      wordFilters: prev.wordFilters.filter(
        (filter) => filter !== filterToRemove
      ),
    }));
    toast({
      title: "Filter Removed",
      description: `Word filter "${filterToRemove}" has been removed.`,
      duration: 3000,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFilter();
    }
  };

  return (
    <Card className="bg-[#171717] shadow-md">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-[8px] text-[20px] font-semibold text-white">
          <Shield className="w-[20px] h-[20px] text-[#dd4870]" />
          Discord Moderation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-[24px]">
        {/* Welcome Message Section */}
        <div className="space-y-[12px]">
          <div className="flex items-center gap-[8px]">
            <MessageCircle className="w-[16px] h-[16px] text-[#dd4870]" />
            <Label
              htmlFor="welcome-message"
              className="text-[14px] font-medium text-white"
            >
              Welcome Message
            </Label>
          </div>

          <div className="space-y-[8px]">
            <Textarea
              id="welcome-message"
              value={settings.welcomeMessage}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  welcomeMessage: e.target.value,
                }))
              }
              placeholder="Enter your welcome message..."
              className="min-h-[80px] bg-black text-white border-none focus:ring-2 focus:ring-primary focus:border-none"
            />
            <div className="flex items-center gap-[8px]">
              <Label
                htmlFor="welcome-message"
                className="text-[14px] text-[#dd4870]"
              >
                {welcomeText}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-[8px] border border-red">
                <Switch
                  id="welcome-toggle"
                  checked={settings.welcomeEnabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      welcomeEnabled: checked,
                    }))
                  }
                />
                <Label
                  htmlFor="welcome-toggle"
                  className="text-[13px] text-white"
                >
                  Enable welcome messages
                </Label>
              </div>
              <Button
                size="sm"
                onClick={() => handleSaveMessage("welcome")}
                className="bg-[black] text-white hover:bg-success/90"
              >
                <Save className="w-[14px] h-[14px] mr-[4px] text-[#dd4870]" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Goodbye Message Section */}
        <div className="space-y-[12px]">
          <div className="flex items-center gap-[8px]">
            <Users className="w-[16px] h-[16px] text-[#dd4870]" />
            <Label
              htmlFor="goodbye-message"
              className="text-[14px] font-medium text-white"
            >
              Goodbye Message
            </Label>
          </div>
          <div className="space-y-[8px]">
            <Textarea
              id="goodbye-message"
              value={settings.goodbyeMessage}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  goodbyeMessage: e.target.value,
                }))
              }
              placeholder="Enter your goodbye message..."
              className="min-h-[80px] bg-black border-none"
            />
            <div className="flex items-center gap-[8px]">
              <Label
                htmlFor="welcome-message"
                className="text-[14px] text-[#dd4870]"
              >
                {welcomeText}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-[8px]">
                <Switch
                  id="goodbye-toggle"
                  checked={settings.goodbyeEnabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      goodbyeEnabled: checked,
                    }))
                  }
                />
                <Label
                  htmlFor="goodbye-toggle"
                  className="text-[13px] text-white"
                >
                  Enable goodbye messages
                </Label>
              </div>
              <Button
                size="sm"
                onClick={() => handleSaveMessage("goodbye")}
                className="bg-[black] text-white hover:bg-success/90"
              >
                <Save className="w-[14px] h-[14px] mr-[4px] text-[#dd4870]" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Word Filters Section */}
        <div className="pt-[16px] border-t border-border space-y-[12px]">
          <div className="flex items-center gap-[8px]">
            <Filter className="w-[16px] h-[16px]  text-[#dd4870]" />
            <Label
              htmlFor="word-filter"
              className="text-[14px] font-medium text-white"
            >
              Word Filters
            </Label>
          </div>
          <div className="space-y-[8px]">
            <Input
              id="word-filter"
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a word to filter and press Enter..."
              className="bg-black border-none text-white"
            />
            <div className="flex flex-wrap gap-[8px]">
              {settings.wordFilters.map((filter, index) => (
                <div
                  key={index}
                  className="flex items-center gap-[4px] bg-destructive/10 text-destructive px-[8px] py-[4px] rounded-md text-[12px]"
                >
                  <span>{filter}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveFilter(filter)}
                    className="h-[16px] w-[16px] p-0 hover:bg-destructive/20"
                  >
                    <X className="w-[10px] h-[10px]" />
                  </Button>
                </div>
              ))}
            </div>
            {settings.wordFilters.length === 0 && (
              <p className="text-[12px] text-white">
                No word filters added yet. Type a word and press Enter to add.
              </p>
            )}
          </div>
        </div>

        {/* Spam Protection */}
        <div className="pt-[16px] border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-[4px]">
              <div className="flex items-center gap-[8px]">
                <Shield className="w-[16px] h-[16px]  text-[#dd4870]" />
                <Label
                  htmlFor="spam-protection"
                  className="text-[14px] font-medium text-white"
                >
                  Spam Protection
                </Label>
              </div>
              <p className="text-[12px] text-white">
                Automatically detect and remove spam messages
              </p>
            </div>
            <Switch
              id="spam-protection"
              checked={settings.spamProtection}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, spamProtection: checked }))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
