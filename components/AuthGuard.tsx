"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    const authPaths = ["/signin", "/signup", "/forgot-password", "/reset"];

    const isAuth = authPaths.some((path) => pathname?.startsWith(path));
    setIsAuthPage(isAuth);
  }, [pathname]);

  // For auth pages, don't run any authentication logic
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For non-auth pages, render normally (authentication will be handled by Protected component)
  return <>{children}</>;
}
