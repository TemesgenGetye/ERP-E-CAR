"use client";

import React from "react";
import { Input } from "./ui/input";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/user";

export default function Header() {
  const pathName = usePathname();
  const isAuthPage = pathName.includes("signin") || pathName.includes("signup");
  const { user } = useUserStore();
  if (isAuthPage) return null;
  return (
    <div
      className="flex items-center justify-between mb-6 px-6 fixed top-0 w-[calc(100%-80px)] left-20 bg-white/70  z-50 py-4"
      style={{ backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center space-x-4">
        {/* search */}
        <div className="text-gray-600 bg-gray-100 rounded-full px-10 shadow-none py-2 relative border  w-[400px] border-transparent focus-within:border-black/10">
          <Input
            placeholder="Search for anything..."
            className="bg-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
          />
          <Search className="absolute top-4 left-5 text-black/70" size={18} />
        </div>
      </div>
      <div className="flex gap-10 items-center">
        {/* notification */}
        <Link href={"/"} className="relative">
          <div className="bg-gray-100 size-10 rounded-full grid place-items-center">
            <Bell />
          </div>
          <div className="size-2 bg-black rounded-full absolute top-1 right-1" />
        </Link>
        <div className="flex items-center space-x-10 bg-gray-100 rounded-full p-4 py-1">
          <div className="flex gap-2 items-center ">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
              alt="user-img"
              className="size-10 rounded-full object-cover"
            />
            <p className="text-sm">Hello, {user.first_name}</p>
          </div>
          <div className="text-gray-500 bg-white rounded-full p-2 text-sm">
            22 May
          </div>
        </div>
      </div>
    </div>
  );
}
