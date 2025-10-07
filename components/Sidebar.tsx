"use client";

import {
  BarChart3,
  Bluetooth,
  Calendar,
  CarFront,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const links = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Cars", href: "/listing", icon: CarFront },
    // { label: "Users", href: "/users", icon: Users },
  ];
  const pathName = usePathname();
  const isAuthPage = pathName.includes("signin") || pathName.includes("signup");
  if (isAuthPage) return null;
  return (
    <aside
      className={`w-20 bg-gray-200 flex flex-col items-center py-6 space-y-6 fixed left-0 top-0 h-full z-10 ${
        isAuthPage && "hidden"
      }`}
    >
      <Link
        href={"/"}
        className="w-8 h-8 rounded-lg flex flex-col items-center justify-center"
      >
        <Image src={"/wheel.png"} alt="logo" width={100} height={100} />
        <p className="text-xs text-black mt-2 font-bold">AUTO_ERP</p>
      </Link>
      <div className="flex flex-col space-y-10 my-30">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathName === link.href
              : pathName.includes(link.href);
          return (
            <Link
              href={link.href}
              key={link.href}
              className={`hover:bg-black hover:text-white cursor-pointer size-10 rounded-full grid place-items-center ${
                active ? " bg-black text-white" : "text-black bg-transparent"
              }`}
            >
              <link.icon className="h-6 w-6" />
            </Link>
          );
        })}
      </div>
      <div className="flex gap-10 flex-col text-white absolute bottom-10">
        <Link
          href={"/settings"}
          className="text-black hover:bg-black hover:text-white cursor-pointer size-10 rounded-full grid place-items-center"
        >
          <Settings className="size-5" />
        </Link>
        <button className="text-black hover:bg-black hover:text-white cursor-pointer size-10 rounded-full grid place-items-center">
          <LogOut className="size-5" />
        </button>
      </div>
    </aside>
  );
}
