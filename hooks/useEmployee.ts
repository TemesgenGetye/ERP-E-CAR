import { useQuery } from "@tanstack/react-query";
import { getEmployee, type EmployeeStaffInfo } from "@/lib/employees";

export const useEmployee = (empId: number | null | undefined) => {
  return useQuery<EmployeeStaffInfo>({
    queryKey: ["employee", empId],
    queryFn: () => getEmployee(empId!),
    enabled: empId != null,
    staleTime: 5 * 60 * 1000,
  });
};
