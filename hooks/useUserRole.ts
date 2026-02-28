import { useMemo, useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { useDealerStaffStore } from "@/store/dealerStaff";
import { useProfile } from "@/hooks/useProfile";
import { useStaff } from "./useStaff";
import { API_URL } from "@/lib/config";
import { getCredentials } from "@/lib/credential";

export type UserRole = "dealer" | "accountant" | "seller" | "hr" | "finance" | null;

export function useUserRole() {
  const { user } = useUserStore();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        const credential = await getCredentials();
        if (!credential?.access) {
          setRole("dealer");
          return;
        }

        const res = await fetch(`${API_URL}/dealers/staff/me`, {
          headers: {
            Authorization: `Bearer ${credential.access}`,
          },
        });

        if (res.ok) {
          const staff = await res.json();
          setRole(staff.role || "dealer");
        } else {
          setRole("dealer");
        }
      } catch (error) {
        setRole("dealer");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [user.email]);

  return { role, isLoading };
}
