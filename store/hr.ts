import { api } from "@/lib/api";
import { create } from "zustand";
import {
  HREmployee,
  CreateHREmployeeRequest,
  Attendance,
  CreateAttendanceRequest,
  Contract,
  CreateContractRequest,
  Leave,
  CreateLeaveRequest,
} from "@/types";

interface HRState {
  employees: HREmployee[];
  attendances: Attendance[];
  contracts: Contract[];
  leaves: Leave[];
  isLoading: boolean;
  error: string | null;

  getEmployees: () => Promise<void>;
  createEmployee: (employee: CreateHREmployeeRequest) => Promise<void>;
  updateEmployee: (
    id: number,
    employee: Partial<CreateHREmployeeRequest>,
  ) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;

  // Attendance actions
  getAttendances: () => Promise<void>;
  createAttendance: (attendance: CreateAttendanceRequest) => Promise<void>;
  updateAttendance: (id: number, attendance: Partial<CreateAttendanceRequest>) => Promise<void>;
  deleteAttendance: (id: number) => Promise<void>;

  // Contract actions
  getContracts: () => Promise<void>;
  createContract: (contract: CreateContractRequest) => Promise<void>;
  updateContract: (id: number, contract: Partial<CreateContractRequest>) => Promise<void>;
  deleteContract: (id: number) => Promise<void>;
  finalizeContract: (id: number, finalDocument: File) => Promise<void>;
  sendContractToEmployee: (id: number) => Promise<void>;
  uploadSignedContract: (id: number, signedDocument: File) => Promise<void>;

  // Leave actions
  getLeaves: () => Promise<void>;
  createLeave: (leave: CreateLeaveRequest) => Promise<void>;
  updateLeave: (id: number, leave: Partial<CreateLeaveRequest>) => Promise<void>;
  deleteLeave: (id: number) => Promise<void>;
}

export const useHRStore = create<HRState>((set, get) => ({
  // Initial state
  employees: [],
  attendances: [],
  contracts: [],
  leaves: [],
  isLoading: false,
  error: null,

  getEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<HREmployee[]>("/hr/employees/", {
        method: "GET",
      });
      set({ employees: res, isLoading: false });
    } catch (error) {
      console.error("Error fetching employees:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createEmployee: async (employee) => {
    set({ isLoading: true });
    try {
      const res = await api<HREmployee>("/hr/employees/", {
        method: "POST",
        body: employee as any,
      });
      set((state) => ({
        employees: [...state.employees, res],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateEmployee: async (id, employee) => {
    set({ isLoading: true });
    try {
      const res = await api<HREmployee>(`/hr/employees/${id}/`, {
        method: "PATCH",
        body: employee as any,
      });
      set((state) => ({
        employees: state.employees.map((emp) => (emp.id === id ? res : emp)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true });
    try {
      await api(`/hr/employees/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Attendance actions
  getAttendances: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Attendance[]>("/hr/attendances/", {
        method: "GET",
      });
      set({ attendances: res, isLoading: false });
    } catch (error) {
      console.error("Error fetching attendances:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createAttendance: async (attendance) => {
    set({ isLoading: true });
    try {
      const res = await api<Attendance>("/hr/attendances/", {
        method: "POST",
        body: attendance as any,
      });
      set((state) => ({
        attendances: [...state.attendances, res],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateAttendance: async (id, attendance) => {
    set({ isLoading: true });
    try {
      const res = await api<Attendance>(`/hr/attendances/${id}/`, {
        method: "PATCH",
        body: attendance as any,
      });
      set((state) => ({
        attendances: state.attendances.map((att) =>
          att.id === id ? res : att
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteAttendance: async (id) => {
    set({ isLoading: true });
    try {
      await api(`/hr/attendances/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        attendances: state.attendances.filter((att) => att.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Contract actions
  getContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Contract[]>("/hr/contracts/", {
        method: "GET",
      });
      set({ contracts: res, isLoading: false });
    } catch (error) {
      console.error("Error fetching contracts:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createContract: async (contract) => {
    set({ isLoading: true });
    try {
      const res = await api<Contract>("/hr/contracts/", {
        method: "POST",
        body: contract as any,
      });
      set((state) => ({
        contracts: [...state.contracts, res],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateContract: async (id, contract) => {
    set({ isLoading: true });
    try {
      const res = await api<Contract>(`/hr/contracts/${id}/`, {
        method: "PATCH",
        body: contract as any,
      });
      set((state) => ({
        contracts: state.contracts.map((cont) =>
          cont.id === id ? res : cont
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteContract: async (id) => {
    set({ isLoading: true });
    try {
      await api(`/hr/contracts/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        contracts: state.contracts.filter((cont) => cont.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  finalizeContract: async (id, finalDocument) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append("final_document", finalDocument);
      await api(`/hr/contracts/${id}/finalize/`, {
        method: "POST",
        body: formData,
      });
      const res = await api<Contract[]>("/hr/contracts/", { method: "GET" });
      set({ contracts: res, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendContractToEmployee: async (id) => {
    set({ isLoading: true });
    try {
      await api(`/hr/contracts/${id}/send_to_employee/`, { method: "POST" });
      const res = await api<Contract[]>("/hr/contracts/", { method: "GET" });
      set({ contracts: res, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  uploadSignedContract: async (id, signedDocument) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append("signed_document", signedDocument);
      await api(`/hr/contracts/${id}/upload_signed/`, {
        method: "POST",
        body: formData,
      });
      const res = await api<Contract[]>("/hr/contracts/", { method: "GET" });
      set({ contracts: res, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Leave actions
  getLeaves: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Leave[]>("/hr/leaves/", {
        method: "GET",
      });
      set({ leaves: res, isLoading: false });
    } catch (error) {
      console.error("Error fetching leaves:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createLeave: async (leave) => {
    set({ isLoading: true });
    try {
      const res = await api<Leave>("/hr/leaves/", {
        method: "POST",
        body: leave as any,
      });
      set((state) => ({
        leaves: [...state.leaves, res],
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateLeave: async (id, leave) => {
    set({ isLoading: true });
    try {
      const res = await api<Leave>(`/hr/leaves/${id}/`, {
        method: "PATCH",
        body: leave as any,
      });
      set((state) => ({
        leaves: state.leaves.map((lev) => (lev.id === id ? res : lev)),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteLeave: async (id) => {
    set({ isLoading: true });
    try {
      await api(`/hr/leaves/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        leaves: state.leaves.filter((lev) => lev.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

