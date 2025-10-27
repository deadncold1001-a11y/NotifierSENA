import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { HeroStatusCard } from "@/components/HeroStatusCard";
import { MetricsGrid } from "@/components/MetricsGrid";
import { ConfigurationPanel } from "@/components/ConfigurationPanel";
import { NotificationHistory } from "@/components/NotificationHistory";
import { ServiceControlPanel } from "@/components/ServiceControlPanel";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ServiceStatus, MonitoringConfig, Notification, UpdateConfig } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: status, isLoading: statusLoading } = useQuery<ServiceStatus>({
    queryKey: ["/api/status"],
    refetchInterval: 5000,
  });

  const { data: config, isLoading: configLoading } = useQuery<MonitoringConfig>({
    queryKey: ["/api/config"],
  });

  const { data: notifications = [], isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    refetchInterval: 10000,
  });

  const saveConfigMutation = useMutation({
    mutationFn: (data: UpdateConfig) => apiRequest("POST", "/api/config", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/config"] });
      toast({
        title: "Configuration saved",
        description: "Your monitoring settings have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const testTelegramMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/test-telegram", {}),
    onSuccess: () => {
      toast({
        title: "Test message sent",
        description: "Check your Telegram for the test notification.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Test failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const manualCheckMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/manual-check", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Manual check completed",
        description: "Forum has been checked for new posts.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Check failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startServiceMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/service/start", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/status"] });
      toast({
        title: "Service started",
        description: "Monitoring service is now active.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to start service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const stopServiceMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/service/stop", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/status"] });
      toast({
        title: "Service stopped",
        description: "Monitoring service has been stopped.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to stop service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const restartServiceMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/service/restart", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/status"] });
      toast({
        title: "Service restarted",
        description: "Monitoring service has been restarted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to restart service",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const healthCheckMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/health-check", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Health check sent",
        description: "Service status has been reported to Telegram.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Health check failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isLoading = statusLoading || configLoading || notificationsLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />
      
      <div className="relative">
        <Header status={status} />

        <main className="container mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {isLoading ? (
              <>
                <Skeleton className="h-48 w-full rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-32 rounded-lg" />
                  <Skeleton className="h-32 rounded-lg" />
                  <Skeleton className="h-32 rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <HeroStatusCard
                  status={status}
                  onManualCheck={() => manualCheckMutation.mutate()}
                  isChecking={manualCheckMutation.isPending}
                />

                <MetricsGrid status={status} />
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {configLoading ? (
                <Skeleton className="h-[600px] rounded-lg" />
              ) : (
                <ConfigurationPanel
                  config={config}
                  onSave={(data) => saveConfigMutation.mutate(data)}
                  onTest={() => testTelegramMutation.mutate()}
                  isSaving={saveConfigMutation.isPending}
                  isTesting={testTelegramMutation.isPending}
                />
              )}

              {notificationsLoading ? (
                <Skeleton className="h-[600px] rounded-lg" />
              ) : (
                <NotificationHistory notifications={notifications} />
              )}
            </div>

            {statusLoading ? (
              <Skeleton className="h-32 rounded-lg" />
            ) : (
              <ServiceControlPanel
                isRunning={status?.isRunning ?? false}
                onStart={() => startServiceMutation.mutate()}
                onStop={() => stopServiceMutation.mutate()}
                onRestart={() => restartServiceMutation.mutate()}
                onHealthCheck={() => healthCheckMutation.mutate()}
                isLoading={
                  startServiceMutation.isPending ||
                  stopServiceMutation.isPending ||
                  restartServiceMutation.isPending ||
                  healthCheckMutation.isPending
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
