import { useQuery } from "@tanstack/react-query";
import { getPayslip, getAllPayslips } from "@/lib/payroll";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface PayslipLineItem {
  name: string;
  amount: string;
}

interface EmployeeInfo {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  contact: string;
  position: string;
  hire_date: string;
}

export interface PayslipData {
  employee: EmployeeInfo;
  payroll_run: number;
  processed_at: string;
  gross_earnings: string;
  total_deductions: string;
  net_salary: string;
  earnings: PayslipLineItem[];
  deductions: PayslipLineItem[];
}

export const usePayslip = () => {
  const { toast } = useToast();
  const {
    data: payslipData,
    isLoading: isLoadingPayslip,
    isFetching: isRefetchingPayslip,
    error: payslipError,
    refetch: refetchPayslip,
  } = useQuery({
    queryKey: ["payslip"],
    queryFn: () => getPayslip(),
  });

  const {
    data: allPayslipsData,
    isLoading: isLoadingAllPayslips,
    isFetching: isRefetchingAllPayslips,
    error: allPayslipsError,
    refetch: refetchAllPayslips,
  } = useQuery({
    queryKey: ["all-payslips"],
    queryFn: () => getAllPayslips(),
    enabled: false,
  });

  useEffect(() => {
    if (payslipError) {
      toast({
        title: "Failed to fetch payslip",
        description: (payslipError as Error).message,
        variant: "destructive",
      });
    }
  }, [payslipError, toast]);

  useEffect(() => {
    if (allPayslipsError) {
      toast({
        title: "Failed to fetch payslips",
        description: (allPayslipsError as Error).message,
        variant: "destructive",
      });
    }
  }, [allPayslipsError, toast]);

  return {
    payslipData: payslipData as PayslipData | undefined,
    isLoadingPayslip,
    isRefetchingPayslip,
    payslipError,
    refetchPayslip,
    allPayslipsData: allPayslipsData as PayslipData[] | undefined,
    isLoadingAllPayslips,
    isRefetchingAllPayslips,
    refetchAllPayslips,
  };
};
