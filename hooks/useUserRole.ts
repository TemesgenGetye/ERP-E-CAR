import { useMemo, useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { useDealerStaffStore } from "@/store/dealerStaff";
import { useProfile } from "@/hooks/useProfile";
import { useStaff } from "./useStaff";
import { API_URL } from "@/lib/config";
import { getCredentials } from "@/lib/credential";

export type UserRole =
  | "dealer"
  | "accountant"
  | "seller"
  | "hr"
  | "finance"
  | null;

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
          setRole(staff.role);
        } else {
          const res = await fetch(`${API_URL}/users/profiles/me`, {
            headers: {
              Authorization: `Bearer ${credential.access}`,
            },
          });
          if (!res.ok) throw new Error(`User not allowed`);
          const dealer = await res.json();
          if (!dealer.role) throw new Error(`No role specified for user`);
          if (dealer.role.toLowerCase() !== "dealer")
            throw new Error(`User is not a dealer.`);
          setRole(dealer.role);
        }
      } catch (error) {
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [user.email]);

  return { role, isLoading };
}
