"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "./loading";

export default function Providers({ children }: { children: React.ReactNode }) {
  // All hooks must be called before any conditional returns
  const { role: userRole, isLoading } = useUserRole();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  // Conditional return after all hooks
  if (isLoading || !userRole) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
