"use client";

import {
  CarFront,
  LayoutDashboard,
  LogOut,
  Settings,
  Calculator,
  TrendingUp,
  UserCheck,
  Briefcase,
  Calendar,
  Receipt,
  DollarSign,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthState } from "@/lib/api";
import { useUserStore } from "@/store/user";
import { useUserRole } from "@/hooks/useUserRole";
import { useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";

export default function Sidebar() {
  const allLinks = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["dealer"] },
    {
      label: "Cars",
      href: "/listing",
      icon: CarFront,
      roles: ["dealer", "seller"],
    },
    { label: "Sales", href: "/sales", icon: TrendingUp, roles: ["seller"] },
    {
      label: "Accounting",
      href: "/accounting",
      icon: Calculator,
      roles: ["accountant"],
    },
    {
      label: "Payroll",
      href: "/payroll",
      icon: Receipt,
      roles: ["accountant"],
    },
    { label: "HR", href: "/hr", icon: Briefcase, roles: ["hr"] },
    {
      label: "Payroll",
      href: "/finance",
      icon: DollarSign,
      roles: ["finance"],
    },
    {
      label: "Payslip",
      href: "/payslip",
      icon: FileText,
      roles: ["seller", "accountant", "hr", "finance"],
    },
    {
      label: "Leaves",
      href: "/leaves",
      icon: Calendar,
      roles: ["hr", "seller", "accountant"],
    },
    { label: "Staff", href: "/staff", icon: UserCheck, roles: ["dealer"] },
    // { label: "Users", href: "/users", icon: Users },
  ];

  const pathName = usePathname();
  const router = useRouter();
  const { clearUser } = useUserStore();
  const { role: userRole, isLoading } = useUserRole();
  const queryClient = useQueryClient();
  const isAuthPage = pathName.includes("signin") || pathName.includes("signup");

  const links = useMemo(() => {
    return allLinks.filter((link) => link.roles.includes(userRole));
  }, [userRole, allLinks]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      // Remove profile query from cache on logout
      queryClient.removeQueries({ queryKey: ["profile"] });
      clearAuthState();
      clearUser();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      // Remove profile query from cache even if logout API fails
      queryClient.removeQueries({ queryKey: ["profile"] });
      clearAuthState();
      clearUser();
      router.push("/signin");
    }
  };

  if (isAuthPage || isLoading) return null;

  return (
    <aside
      key={`sidebar-${userRole}`}
      className={`w-20 bg-primary flex flex-col items-center py-6 space-y-6 fixed left-0 top-0 h-full border-r border-primary-hover/20 z-10 ${
        isAuthPage && "hidden"
      }`}
    >
      <Link
        href={"/"}
        className="w-8 h-8 rounded-lg flex flex-col items-center justify-center"
      >
        <Image
          src={"/wheel.png"}
          alt="logo"
          width={100}
          height={100}
          className="invert brightness-0"
        />
        <p className="text-[10px] text-primary-foreground mt-2 font-bold tracking-tighter">
          Hulucars
        </p>
      </Link>
      <div className="flex flex-col space-y-10 my-30">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathName === link.href
              : pathName.includes(link.href);
          return (
            <div
              key={link.href}
              className="relative group flex items-center flex-col gap-2"
            >
              <Link
                href={link.href}
                className={`hover:bg-primary-hover hover:text-white cursor-pointer size-10 rounded-full grid place-items-center transition-colors ${
                  active
                    ? " bg-white text-primary shadow-md"
                    : "text-primary-foreground bg-transparent"
                }`}
              >
                <link.icon className="h-6 w-6" />
              </Link>
              {/* Hover Label */}
              <div className="transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap">
                <span className="text-white text-xs px-2 py-1 rounded">
                  {link.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-10 flex-col absolute bottom-10">
        <div className="relative group flex items-center flex-col gap-2">
          <Link
            href={"/settings"}
            className="text-primary-foreground hover:bg-primary-hover hover:text-white cursor-pointer size-10 rounded-full grid place-items-center transition-colors"
          >
            <Settings className="size-5" />
          </Link>
          {/* Hover Label */}
          <div className=" top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap">
            <span className="text-white text-xs px-2 py-1 rounded">
              Settings
            </span>
          </div>
        </div>
        <div className="relative group flex items-center flex-col gap-2">
          <button
            onClick={handleLogout}
            className="text-primary-foreground hover:bg-primary-hover hover:text-white cursor-pointer size-10 rounded-full grid place-items-center transition-colors"
          >
            <LogOut className="size-5" />
          </button>
          {/* Hover Label */}
          <div className=" top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap">
            <span className="text-white text-xs px-2 py-1 rounded">Logout</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
