import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Hash, Link2, Clock, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateConfigSchema, type UpdateConfig, type MonitoringConfig } from "@shared/schema";

interface ConfigurationPanelProps {
  config?: MonitoringConfig;
  onSave: (data: UpdateConfig) => void;
  onTest: () => void;
  isSaving: boolean;
  isTesting: boolean;
}

export function ConfigurationPanel({
  config,
  onSave,
  onTest,
  isSaving,
  isTesting,
}: ConfigurationPanelProps) {
  const [showToken, setShowToken] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateConfig>({
    resolver: zodResolver(updateConfigSchema),
    defaultValues: {
      telegramBotToken: "",
      telegramChatId: "",
      forumUrl: "https://zajuna.sena.edu.co/zajuna/mod/forum/view.php?id=5024822",
      checkInterval: 30,
    },
  });

  useEffect(() => {
    if (config) {
      reset({
        telegramBotToken: config.telegramBotToken,
        telegramChatId: config.telegramChatId,
        forumUrl: config.forumUrl,
        checkInterval: config.checkInterval,
      });
    }
  }, [config, reset]);

  const checkInterval = watch("checkInterval");

  return (
    <Card className="p-6 rounded-lg border-card-border bg-card" data-testid="card-configuration">
      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Manage your monitoring settings and credentials
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Send className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Telegram Configuration</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegramBotToken" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Bot Token
              </Label>
              <div className="relative">
                <Input
                  id="telegramBotToken"
                  type={showToken ? "text" : "password"}
                  placeholder="123456789:ABCdefGhIjklMNOpqrsTUVwxyz"
                  className="pr-10 font-mono text-sm"
                  {...register("telegramBotToken")}
                  data-testid="input-bot-token"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="button-toggle-token"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.telegramBotToken && (
                <p className="text-sm text-destructive">{errors.telegramBotToken.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Get your bot token from @BotFather on Telegram
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telegramChatId" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Chat ID
              </Label>
              <Input
                id="telegramChatId"
                type="text"
                placeholder="-1003249465224"
                className="font-mono text-sm"
                {...register("telegramChatId")}
                data-testid="input-chat-id"
              />
              {errors.telegramChatId && (
                <p className="text-sm text-destructive">{errors.telegramChatId.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                The chat or group ID where notifications will be sent
              </p>
            </div>
          </div>

          <div className="space-y-4 p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="h-4 w-4 text-primary" />
              <h4 className="font-medium">Forum Monitoring</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forumUrl">Forum URL</Label>
              <Input
                id="forumUrl"
                type="url"
                placeholder="https://zajuna.sena.edu.co/..."
                className="font-mono text-sm"
                {...register("forumUrl")}
                data-testid="input-forum-url"
              />
              {errors.forumUrl && (
                <p className="text-sm text-destructive">{errors.forumUrl.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                The forum page URL to monitor for new posts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkInterval" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Check Interval
              </Label>
              <Select
                value={checkInterval?.toString()}
                onValueChange={(value) => setValue("checkInterval", parseInt(value))}
              >
                <SelectTrigger id="checkInterval" data-testid="select-check-interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="10">Every 10 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How often to check for new forum posts
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1"
            data-testid="button-save-config"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onTest}
            disabled={isTesting}
            data-testid="button-test-telegram"
          >
            {isTesting ? 'Testing...' : 'Test Telegram'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
