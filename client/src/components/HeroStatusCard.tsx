import { PlayCircle, StopCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServiceStatus } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface HeroStatusCardProps {
  status?: ServiceStatus;
  onManualCheck: () => void;
  isChecking: boolean;
}

export function HeroStatusCard({ status, onManualCheck, isChecking }: HeroStatusCardProps) {
  const isRunning = status?.isRunning ?? false;
  const uptime = status?.serviceStartedAt
    ? formatDistanceToNow(new Date(status.serviceStartedAt), { addSuffix: false })
    : "Not running";
  const lastCheck = status?.lastCheckAt
    ? formatDistanceToNow(new Date(status.lastCheckAt), { addSuffix: true })
    : "Never";

  return (
    <Card className="p-8 rounded-xl border-card-border bg-card" data-testid="hero-status-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {isRunning ? (
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <PlayCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <StopCircle className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div>
              <h2 className="text-2xl font-semibold" data-testid="text-service-status">
                {isRunning ? 'Service Running' : 'Service Stopped'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Monitoring forum for new posts
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Uptime:</span>
                <span className="font-medium" data-testid="text-uptime">{uptime}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last check:</span>
                <span className="font-medium" data-testid="text-last-check">{lastCheck}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            onClick={onManualCheck}
            disabled={isChecking || !isRunning}
            size="lg"
            className="w-full lg:w-auto"
            data-testid="button-manual-check"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Manual Check Now'}
          </Button>
        </div>
      </div>

      {status?.lastError && (
        <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive font-medium">Last Error:</p>
          <p className="text-sm text-destructive/80 mt-1 font-mono" data-testid="text-last-error">
            {status.lastError}
          </p>
        </div>
      )}
    </Card>
  );
}
