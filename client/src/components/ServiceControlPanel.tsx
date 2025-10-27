import { Play, Square, RotateCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ServiceControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
  onHealthCheck: () => void;
  isLoading?: boolean;
}

export function ServiceControlPanel({
  isRunning,
  onStart,
  onStop,
  onRestart,
  onHealthCheck,
  isLoading = false,
}: ServiceControlPanelProps) {
  return (
    <Card className="p-6 rounded-lg border-card-border bg-card" data-testid="card-service-control">
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-1">Service Control</h3>
        <p className="text-sm text-muted-foreground">
          Manage the monitoring service lifecycle
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onStart}
          disabled={isRunning || isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          data-testid="button-start-service"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Service
        </Button>

        <Button
          onClick={onStop}
          disabled={!isRunning || isLoading}
          variant="outline"
          className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          data-testid="button-stop-service"
        >
          <Square className="h-4 w-4 mr-2" />
          Stop Service
        </Button>

        <Button
          onClick={onRestart}
          disabled={!isRunning || isLoading}
          variant="outline"
          className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950"
          data-testid="button-restart-service"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Restart Service
        </Button>

        <Button
          onClick={onHealthCheck}
          disabled={isLoading}
          variant="outline"
          data-testid="button-health-check"
        >
          <Activity className="h-4 w-4 mr-2" />
          Health Check
        </Button>
      </div>
    </Card>
  );
}
