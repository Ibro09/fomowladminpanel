import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Ban, MessageSquareX, UserX, Clock } from "lucide-react";

interface LogEntry {
  id: string;
  action: "warning" | "ban" | "message_deleted" | "user_kicked";
  username: string;
  reason: string;
  timestamp: string;
  moderator: string;
}

const logs: LogEntry[] = [
  {
    id: "1",
    action: "message_deleted",
    username: "user123",
    reason: "Spam content detected",
    timestamp: "2 minutes ago",
    moderator: "AutoMod"
  },
  {
    id: "2",
    action: "warning",
    username: "troublemaker",
    reason: "Inappropriate language",
    timestamp: "15 minutes ago",
    moderator: "Admin"
  },
  {
    id: "3",
    action: "ban",
    username: "spammer_bot",
    reason: "Repeated spam violations",
    timestamp: "1 hour ago",
    moderator: "Moderator1"
  },
  {
    id: "4",
    action: "user_kicked",
    username: "rulebreaker",
    reason: "Excessive off-topic posting",
    timestamp: "2 hours ago",
    moderator: "Admin"
  },
  {
    id: "5",
    action: "message_deleted",
    username: "newbie2024",
    reason: "Accidental duplicate post",
    timestamp: "3 hours ago",
    moderator: "Moderator2"
  },
];

const getActionIcon = (action: string) => {
  switch (action) {
    case "warning":
      return <AlertTriangle className="w-[14px] h-[14px] text-warning" />;
    case "ban":
      return <Ban className="w-[14px] h-[14px] text-destructive" />;
    case "message_deleted":
      return <MessageSquareX className="w-[14px] h-[14px] text-muted-foreground" />;
    case "user_kicked":
      return <UserX className="w-[14px] h-[14px] text-destructive" />;
    default:
      return <Clock className="w-[14px] h-[14px] text-muted-foreground" />;
  }
};

const getActionBadge = (action: string) => {
  switch (action) {
    case "warning":
      return <Badge variant="outline" className="text-warning border-warning bg-warning/10">Warning</Badge>;
    case "ban":
      return <Badge variant="destructive">Ban</Badge>;
    case "message_deleted":
      return <Badge variant="secondary">Message Deleted</Badge>;
    case "user_kicked":
      return <Badge variant="destructive">Kicked</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export const ModerationLogs = () => {
  return (
    <Card className="bg-card shadow-md">
      <CardHeader className="pb-[16px]">
        <CardTitle className="flex items-center gap-[8px] text-[20px] font-semibold text-foreground">
          <Clock className="w-[20px] h-[20px] text-primary" />
          Recent Moderation Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-[16px]">
          <div className="space-y-[12px]">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-[12px] p-[12px] rounded-lg bg-background border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="mt-[4px]">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 space-y-[4px]">
                  <div className="flex items-center gap-[8px] flex-wrap">
                    {getActionBadge(log.action)}
                    <span className="text-[13px] font-medium text-foreground">@{log.username}</span>
                    <span className="text-[12px] text-muted-foreground">by {log.moderator}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground">{log.reason}</p>
                  <p className="text-[11px] text-muted-foreground">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};