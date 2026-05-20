import { useQuery } from "@tanstack/react-query";
import { getPayslip } from "@/lib/payroll";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface PayslipLineItem {
  name: string;
  amount: string;
}

interface PayslipData {
  employee: number;
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
    error: payslipError,
    refetch: refetchPayslip,
  } = useQuery({
    queryKey: ["payslip"],
    queryFn: () => getPayslip(),
  });

  useEffect(() => {
    if (payslipError) {
      toast({
        title: "Error",
        description: "Failed to fetch payslip data",
        variant: "destructive",
      });
    }
  }, [payslipError, toast]);

  return {
    payslipData: payslipData as PayslipData[],
    isLoadingPayslip,
    payslipError,
    refetchPayslip,
  };
};
