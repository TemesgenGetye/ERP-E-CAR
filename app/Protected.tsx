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
      pathname?.startsWith("/forgot-password");

    if (!isLogged && isAuthPath) {
      setIsMounted(true);
      return;
    }

    if (!isLogged) {
      clearAuthState();
      router.push("/signin");
      return;
    }

    const refreshUserCredentials = async () => {
      try {
        if (!isLogged) return;
        console.log("Fetching user credentials from /api/me...");
        const res = await fetch("/api/me");
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);

        if (!data.ok) {
          console.error("Token refresh failed:", data.message);
          clearAuthState();
          throw new Error("error refreshing token.");
        }
        if (!data.user) {
          console.error("No user data in response");
          clearAuthState();
          throw new Error("Error refreshing user.");
        }
        console.log("User data loaded successfully:", data.user);
        setUser(data.user);

        initializeAuthState(data.user);

        console.log("Setting isMounted to true");
        setIsMounted(true);
      } catch (err: any) {
        console.error("Error in refreshUserCredentials:", err.message);
        clearAuthState();
        router.push("/signin");
      }
    };

    refreshUserCredentials();
  }, [isLogged, router, setUser]);
  if (!isMounted) return <Loading />;
  return <div>{children}</div>;
}
