"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "./loading";
import { ShieldOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuthState } from "@/lib/api";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { role: userRole, isLoading } = useUserRole();
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const handleBackToSignIn = async () => {
    await fetch("/api/logout", { method: "POST" });
    clearAuthState();
    router.push("/signin");
  };

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="flex justify-center mb-6">
              <div className="bg-red-50 p-4 rounded-full">
                <ShieldOff className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Access Denied
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              You don&apos;t have permission to access this site. Contact your
              administrator to get the appropriate role assigned to your account.
            </p>
            <button
              onClick={handleBackToSignIn}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:opacity-90 transition-opacity"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
