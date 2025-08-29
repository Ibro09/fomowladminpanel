import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Hash, MessageSquare } from "lucide-react";

interface Server {
  id: string;
  name: string;
  type: "telegram" | "discord";
  memberCount: number;
  isActive: boolean;
}

const servers: Server[] = [
  { id: "1", name: "Gaming Community", type: "discord", memberCount: 1234, isActive: true },
  { id: "2", name: "Tech Support Group", type: "telegram", memberCount: 567, isActive: true },
  { id: "3", name: "General Discussion", type: "discord", memberCount: 890, isActive: false },
];

interface ServerSelectorProps {
  selectedServer: string;
  onServerChange: (serverId: string) => void;
}

export const ServerSelector = ({ selectedServer, onServerChange }: ServerSelectorProps) => {
  const currentServer = servers.find(s => s.id === selectedServer);
  
  return (
    <div className="w-full">
      <label className="text-[14px] font-medium text-white mb-[8px] block">
        Select Server/Group
      </label>
      <Select value={selectedServer} onValueChange={onServerChange}>
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder="Choose a server or group to manage">
            {currentServer && (
              <div className="flex items-center gap-[12px]">
                {currentServer.type === "discord" ? (
                  <Hash className="w-[16px] h-[16px] text-primary" />
                ) : (
                  <MessageSquare className="w-[16px] h-[16px] text-primary" />
                )}
                <span className="font-medium text-foreground">{currentServer.name}</span>
                <Badge variant={currentServer.isActive ? "default" : "secondary"} className="text-[11px]">
                  {currentServer.memberCount} members
                </Badge>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {servers.map((server) => (
            <SelectItem key={server.id} value={server.id} className="focus:bg-accent">
              <div className="flex items-center gap-[12px] w-full">
                {server.type === "discord" ? (
                  <Hash className="w-[16px] h-[16px] text-primary" />
                ) : (
                  <MessageSquare className="w-[16px] h-[16px] text-primary" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-foreground">{server.name}</div>
                  <div className="text-[12px] text-muted-foreground capitalize">
                    {server.type} • {server.memberCount} members
                  </div>
                </div>
                {server.isActive && (
                  <div className="w-[8px] h-[8px] bg-success rounded-full"></div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};