"use client";

import React, { ReactElement, useEffect, useState } from "react";
import Loading from "./loading";
import { useUserStore } from "@/store/user";
import { useRouter, usePathname } from "next/navigation";
import { initializeAuthState, clearAuthState } from "@/lib/api";

export default function Protected({
  children,
  isLogged,
}: {
  children: ReactElement;
  isLogged: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { setUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthPath =
      pathname?.startsWith("/signin") ||
      pathname?.startsWith("/signup") ||
      pathname?.startsWith("/forgot-password") ||
      pathname?.startsWith("/reset");

    // For auth pages, just mount immediately without any auth logic
    if (isAuthPath) {
      setIsMounted(true);
      return;
    }

    // For non-auth pages, check if user is logged in
    if (!isLogged) {
      clearAuthState();
      router.push("/signin");
      return;
    }

    // Only run auth refresh for logged-in users on non-auth pages
    const refreshUserCredentials = async () => {
      try {
        console.log("Fetching user credentials from /api/me...");
        const res = await fetch("/api/me");
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);

        if (!data.ok) {
          console.error("Token refresh failed:", data.message);
          clearAuthState();
          router.push("/signin");
          return;
        }
        if (!data.user) {
          console.error("No user data in response");
          clearAuthState();
          router.push("/signin");
          return;
        }
        console.log("User data loaded successfully:", data.user);
        setUser(data.user);
        initializeAuthState(data.user);
        setIsMounted(true);
      } catch (err: any) {
        console.error("Error in refreshUserCredentials:", err.message);
        clearAuthState();
        router.push("/signin");
      }
    };

    refreshUserCredentials();
  }, [isLogged, router, setUser, pathname]);
  if (!isMounted) return <Loading />;
  return <div>{children}</div>;
}
