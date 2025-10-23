import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const useAuthGuard = () => {
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authPaths = ["/signin", "/signup", "/forgot-password", "/reset"];

    const isAuth = authPaths.some((path) => pathname?.startsWith(path));
    setIsAuthPage(isAuth);
    setIsLoading(false);
  }, [pathname]);

  return {
    isAuthPage,
    isLoading,
    canMakeApiCalls: !isAuthPage,
  };
};
