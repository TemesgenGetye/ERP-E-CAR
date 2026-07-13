import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Leave } from "@/types";

const QUERY_KEY = ["leaves"] as const;

const fetchLeaves = () => api<Leave[]>("/hr/leaves/", { method: "GET" });

export const useLeaves = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: leaves = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchLeaves,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) =>
      api(`/hr/leaves/${id}/approve/`, { method: "POST" }),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Leave approved",
        description: "The leave request has been approved.",
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to approve leave",
        description: "Please try again.",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) =>
      api(`/hr/leaves/${id}/reject/`, { method: "POST" }),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Leave rejected",
        description: "The leave request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to reject leave",
        description: "Please try again.",
      });
    },
  });

  return {
    leaves,
    isLoading,
    error,
    approveLeave: (id: number) => approveMutation.mutate(id),
    rejectLeave: (id: number) => rejectMutation.mutate(id),
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
