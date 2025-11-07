import { api } from "@/lib/api";
import { create } from "zustand";
import {
  Employee,
  CreateEmployeeRequest,
  Attendance,
  CreateAttendanceRequest,
  Contract,
  CreateContractRequest,
  Leave,
  CreateLeaveRequest,
} from "@/types";

interface HRState {
  // State
  employees: Employee[];
  attendances: Attendance[];
  contracts: Contract[];
  leaves: Leave[];
  isLoading: boolean;
  error: string | null;

  // Employee actions
  getEmployees: () => Promise<void>;
  createEmployee: (employee: CreateEmployeeRequest) => Promise<void>;
  updateEmployee: (id: number, employee: Partial<CreateEmployeeRequest>) => Promise<void>;
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

  // Employee actions
  getEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Employee[]>("/hr/employees/", {
        method: "GET",
      });
      set({ employees: res, isLoading: false });
    } catch (error) {
      console.error("Error fetching employees:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createEmployee: async (employee) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Employee>("/hr/employees/", {
        method: "POST",
        body: employee as any,
      });
      set((state) => ({
        employees: [...state.employees, res],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error creating employee:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateEmployee: async (id, employee) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api<Employee>(`/hr/employees/${id}/`, {
        method: "PATCH",
        body: employee as any,
      });
      set((state) => ({
        employees: state.employees.map((emp) =>
          emp.id === id ? res : emp
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating employee:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/hr/employees/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        employees: state.employees.filter((emp) => emp.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting employee:", error);
      set({ error: (error as Error).message, isLoading: false });
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
    set({ isLoading: true, error: null });
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
      console.error("Error creating attendance:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateAttendance: async (id, attendance) => {
    set({ isLoading: true, error: null });
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
      console.error("Error updating attendance:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteAttendance: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/hr/attendances/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        attendances: state.attendances.filter((att) => att.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting attendance:", error);
      set({ error: (error as Error).message, isLoading: false });
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
    set({ isLoading: true, error: null });
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
      console.error("Error creating contract:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateContract: async (id, contract) => {
    set({ isLoading: true, error: null });
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
      console.error("Error updating contract:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteContract: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/hr/contracts/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        contracts: state.contracts.filter((cont) => cont.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting contract:", error);
      set({ error: (error as Error).message, isLoading: false });
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
    set({ isLoading: true, error: null });
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
      console.error("Error creating leave:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateLeave: async (id, leave) => {
    set({ isLoading: true, error: null });
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
      console.error("Error updating leave:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteLeave: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api(`/hr/leaves/${id}/`, {
        method: "DELETE",
      });
      set((state) => ({
        leaves: state.leaves.filter((lev) => lev.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting leave:", error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
}));

