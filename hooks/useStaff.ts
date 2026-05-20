import { API_URL } from "@/lib/config";
import { getCredentials } from "@/lib/credential";
import { useQuery } from "@tanstack/react-query";
import type { DealerStaff } from "@/types";


export async function useStaff() {
  const credential = await getCredentials();
  const { access } = credential;
  const { data: staffs } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/dealers/staff`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      return res.json() as Promise<DealerStaff[]>;
    },
  });
  return staffs;
}
