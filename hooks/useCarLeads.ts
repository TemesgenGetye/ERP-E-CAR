import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Lead } from "@/types";
import { useAuthGuard } from "./useAuthGuard";

interface CarLead extends Lead {
  initials?: string;
  email?: string;
}

export const useCarLeads = (carId: string | number | undefined) => {
  const [leads, setLeads] = useState<CarLead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canMakeApiCalls } = useAuthGuard();

  const fetchLeads = async () => {
    if (!carId || !canMakeApiCalls) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api<Lead[]>(`/sales/leads/`, {
        method: "GET",
      });

      // Filter leads for the specific car and transform the data
      const carLeads: CarLead[] = response
        .filter((lead) => lead.car === Number(carId))
        .map((lead) => {
          // Generate initials from name
          const nameParts = lead.name.trim().split(" ");
          const initials =
            nameParts.length >= 2
              ? `${nameParts[0][0]}${
                  nameParts[nameParts.length - 1][0]
                }`.toUpperCase()
              : nameParts[0].substring(0, 2).toUpperCase();

          // Check if contact is an email or phone
          const isEmail = lead.contact.includes("@");

          return {
            ...lead,
            initials,
            email: isEmail ? lead.contact : undefined,
            phone: isEmail ? undefined : lead.contact,
          };
        });

      setLeads(carLeads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch leads");
      console.error("Error fetching car leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const updatedLead = await api<Lead>(`/sales/leads/${leadId}/`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId ? { ...lead, status: updatedLead.status } : lead
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update lead status"
      );
      console.error("Error updating lead status:", err);
    }
  };

  const deleteLead = async (leadId: number) => {
    try {
      await api(`/sales/leads/${leadId}/`, {
        method: "DELETE",
      });

      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lead");
      console.error("Error deleting lead:", err);
    }
  };

  useEffect(() => {
    if (canMakeApiCalls) {
      fetchLeads();
    }
  }, [carId, canMakeApiCalls]);

  return {
    leads,
    isLoading,
    error,
    fetchLeads,
    updateLeadStatus,
    deleteLead,
  };
};
