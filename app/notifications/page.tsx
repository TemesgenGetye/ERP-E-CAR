"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingId, setMarkingId] = useState<number | null>(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await api<Notification[]>("/notifications/", {
        method: "GET",
      });
      setNotifications(data);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    setMarkingId(id);
    try {
      await api("/notifications/mark_read/", {
        method: "POST",
        body: { id } as any,
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      toast({
        title: "Marked as read",
        variant: "success",
        description: "Notification marked as read.",
      });
    } catch (error) {
      toast({
        title: "Failed to mark as read",
        variant: "destructive",
        description: (error as Error).message,
      });
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.is_read);
    await Promise.all(unread.map((n) => handleMarkAsRead(n.id)));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Notifications
            </h1>
            <p className="text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card className="bg-none! shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
              {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-16">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start justify-between p-4 rounded-lg border transition-colors ${
                      notification.is_read
                        ? "bg-background border-border"
                        : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {notification.is_read ? (
                          <Circle className="h-3 w-3 text-muted-foreground/40 fill-muted-foreground/20" />
                        ) : (
                          <Circle className="h-3 w-3 text-primary fill-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm ${notification.is_read ? "text-muted-foreground" : "text-foreground font-medium"}`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-4 shrink-0 text-xs bg-accent text-accent-foreground cursor-pointer"
                        disabled={markingId === notification.id}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        {markingId === notification.id ? "..." : "Mark read"}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
