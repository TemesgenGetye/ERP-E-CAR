"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user";
import { useUserRole } from "@/hooks/useUserRole";
import { useProfileDetail } from "@/hooks/useProfileDetail";
import { api } from "@/lib/api";
import { Notification } from "@/types/notification";

export default function Header() {
  const pathName = usePathname();
  const isAuthPage = pathName.includes("signin") || pathName.includes("signup");
  const { user } = useUserStore();
  const { role: userRole } = useUserRole();
  const { profile } = useProfileDetail();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthPage) return;
    api<Notification[]>("/notifications/", { method: "GET" })
      .then((data) => setUnreadCount(data.filter((n) => !n.is_read).length))
      .catch(() => {});
  }, [isAuthPage]);

  if (isAuthPage) return null;
  return (
    <div
      className="flex items-center justify-between mb-6 px-4 md:px-6 fixed top-0 w-full md:w-[calc(100%-80px)] left-0 md:left-20 bg-background/70 z-50 py-4"
      style={{ backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center space-x-4"></div>
      <div className="flex gap-6 items-center">
        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold leading-none rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
        {/* Profile Avatar with Name */}
        <Link href="/settings" className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Avatar className="size-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <AvatarImage
              src={profile?.image || profile?.image_url}
              alt={`${profile?.first_name || ""} ${profile?.last_name || ""}`}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {profile?.first_name?.charAt(0)?.toUpperCase() || ""}
              {profile?.last_name?.charAt(0)?.toUpperCase() || ""}
              {!profile?.first_name && !profile?.last_name && user?.email?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {profile?.first_name && profile?.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : profile?.first_name
                  ? profile.first_name
                  : user?.email?.split("@")[0] || "User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {userRole === "dealer"
                ? "System Admin"
                : userRole === "hr"
                  ? "HR"
                  : userRole === "accountant"
                    ? "Accountant"
                    : userRole === "seller"
                      ? "Seller"
                      : ""}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
