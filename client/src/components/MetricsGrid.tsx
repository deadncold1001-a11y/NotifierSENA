import { Clock, Bell, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ServiceStatus } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface MetricsGridProps {
  status?: ServiceStatus;
}

export function MetricsGrid({ status }: MetricsGridProps) {
  const lastSuccessful = status?.lastSuccessfulCheckAt
    ? formatDistanceToNow(new Date(status.lastSuccessfulCheckAt), { addSuffix: true })
    : "Never";

  const totalNotifications = status?.totalNotificationsSent ?? 0;
  
  const uptime = status?.serviceStartedAt && status?.isRunning
    ? formatDistanceToNow(new Date(status.serviceStartedAt), { addSuffix: false })
    : "Not running";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 rounded-lg border-card-border bg-card" data-testid="card-last-check">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last Successful Check
            </p>
            <p className="text-2xl font-bold" data-testid="text-last-successful">
              {lastSuccessful}
            </p>
            <p className="text-xs text-muted-foreground">
              Forum status verified
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-lg border-card-border bg-card" data-testid="card-notifications">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Notifications Sent
            </p>
            <p className="text-2xl font-bold" data-testid="text-notification-count">
              {totalNotifications}
            </p>
            <p className="text-xs text-muted-foreground">
              Telegram messages delivered
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center flex-shrink-0">
            <Bell className="h-5 w-5 text-chart-2" />
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-lg border-card-border bg-card" data-testid="card-uptime">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Service Uptime
            </p>
            <p className="text-2xl font-bold" data-testid="text-service-uptime">
              {uptime}
            </p>
            <p className="text-xs text-muted-foreground">
              Continuous monitoring
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center flex-shrink-0">
            <Activity className="h-5 w-5 text-chart-3" />
          </div>
        </div>
      </Card>
    </div>
  );
}
