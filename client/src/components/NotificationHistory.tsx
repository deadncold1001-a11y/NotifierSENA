import { Bell, CheckCircle2, XCircle, Info, Megaphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";

interface NotificationHistoryProps {
  notifications: Notification[];
}

const getIconForType = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    case "new_post":
      return <Megaphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

export function NotificationHistory({ notifications }: NotificationHistoryProps) {
  return (
    <Card className="p-6 rounded-lg border-card-border bg-card" data-testid="card-notification-history">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-1">Notification History</h3>
        <p className="text-sm text-muted-foreground">
          Recent activity and alerts
        </p>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="empty-notifications">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Notifications will appear here when the service detects new posts
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                data-testid={`notification-${index}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm break-words" data-testid={`notification-message-${index}`}>
                    {notification.message}
                  </p>
                  <p
                    className="text-xs text-muted-foreground font-mono"
                    title={format(new Date(notification.createdAt), "PPpp")}
                    data-testid={`notification-time-${index}`}
                  >
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}
