import type { DealerStaff } from "@/types";

export function dealerStaffFullName(staff: DealerStaff): string {
  const name = `${staff.user.first_name} ${staff.user.last_name}`.trim();
  return name || staff.user.email;
}

export function dealerStaffEmail(staff: DealerStaff): string {
  return staff.user.email;
}
