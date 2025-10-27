import { Activity, Bell } from "lucide-react";
import { ServiceStatus } from "@shared/schema";

interface HeaderProps {
  status?: ServiceStatus;
}

export function Header({ status }: HeaderProps) {
  const isRunning = status?.isRunning ?? false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Forum Monitor</h1>
              <p className="text-xs text-muted-foreground">SENA Zajuna Watcher</p>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: isRunning ? 'hsl(142 76% 36% / 0.1)' : 'hsl(0 84% 60% / 0.1)',
              border: `1px solid ${isRunning ? 'hsl(142 76% 36% / 0.2)' : 'hsl(0 84% 60% / 0.2)'}`,
            }}
            data-testid="status-badge"
          >
            <span
              className={`h-2 w-2 rounded-full ${isRunning ? 'bg-green-600 animate-pulse-dot' : 'bg-red-500'}`}
            />
            <span className={isRunning ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
              {isRunning ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
