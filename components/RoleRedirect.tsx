"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { getDefaultRoute } from "@/lib/getDefaultRoute";

/**
 * Component that automatically redirects users to their role's default page
 * when their role changes or when they're on an inaccessible page
 */
export default function RoleRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { role: userRole } = useUserRole();
  const previousRoleRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);

  // Define which paths are accessible for each role
  const roleAccessiblePaths: Record<string, string[]> = {
    dealer: ["/", "/listing", "/staff", "/settings", "/analytics", "/sales"],
    accountant: ["/accounting", "/payroll", "/settings", "/leaves", "payslip"],
    hr: ["/hr", "/settings", "/leaves", "payslip"],
    seller: ["/listing", "/sales", "/settings", "payslip", "/leaves"],
  };

  useEffect(() => {
    // Skip redirect on auth pages
    if (
      pathname?.startsWith("/signin") ||
      pathname?.startsWith("/signup") ||
      pathname?.startsWith("/forgot-password") ||
      pathname?.startsWith("/reset")
    ) {
      return;
    }

    const currentRole = userRole ?? "";
    const previousRole = previousRoleRef.current;
    const accessiblePaths = currentRole ? roleAccessiblePaths[currentRole] ?? [] : [];
    const defaultRoute = currentRole ? getDefaultRoute(currentRole) : "/";

    // Check if current path is accessible for the current role
    const isCurrentPathAccessible = accessiblePaths.some((path: string) => {
      if (path === "/") {
        return pathname === "/";
      }
      return pathname?.startsWith(path);
    });

    // On initial mount, if we're not on an accessible path, redirect
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (!isCurrentPathAccessible && pathname !== defaultRoute) {
        router.replace(defaultRoute);
        previousRoleRef.current = currentRole;
        return;
      }
    }

    // If role changed, always redirect to default route
    if (previousRole && previousRole !== currentRole) {
      router.replace(defaultRoute);
      previousRoleRef.current = currentRole;
      return;
    }

    // If current path is not accessible for this role, redirect to default
    if (!isCurrentPathAccessible && pathname !== defaultRoute) {
      router.replace(defaultRoute);
    }

    // Update previous role
    previousRoleRef.current = currentRole;
  }, [userRole, pathname, router]);

  return null; // This component doesn't render anything
}
