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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

    // Check if user has tokens in localStorage
    const checkAuthStatus = () => {
      try {
        const authData = localStorage.getItem("auth-tokens");
        if (authData) {
          const parsed = JSON.parse(authData);
          if (parsed.access && parsed.user) {
            setIsAuthenticated(true);
            setUser(parsed.user);
            setIsMounted(true);
            return;
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }

      // No valid auth data, redirect to signin
      clearAuthState();
      router.push("/signin");
    };

    checkAuthStatus();
  }, [router, setUser, pathname]);
  if (!isMounted) return <Loading />;
  return <div>{children}</div>;
}
