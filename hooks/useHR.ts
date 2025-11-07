import { useHRStore } from "@/store/hr";
import { useEffect } from "react";

export const useHR = () => {
  const employees = useHRStore((state) => state.employees);
  const attendances = useHRStore((state) => state.attendances);
  const contracts = useHRStore((state) => state.contracts);
  const leaves = useHRStore((state) => state.leaves);
  const isLoading = useHRStore((state) => state.isLoading);
  const error = useHRStore((state) => state.error);

  const getEmployees = useHRStore((state) => state.getEmployees);
  const createEmployee = useHRStore((state) => state.createEmployee);
  const updateEmployee = useHRStore((state) => state.updateEmployee);
  const deleteEmployee = useHRStore((state) => state.deleteEmployee);

  const getAttendances = useHRStore((state) => state.getAttendances);
  const createAttendance = useHRStore((state) => state.createAttendance);
  const updateAttendance = useHRStore((state) => state.updateAttendance);
  const deleteAttendance = useHRStore((state) => state.deleteAttendance);

  const getContracts = useHRStore((state) => state.getContracts);
  const createContract = useHRStore((state) => state.createContract);
  const updateContract = useHRStore((state) => state.updateContract);
  const deleteContract = useHRStore((state) => state.deleteContract);

  const getLeaves = useHRStore((state) => state.getLeaves);
  const createLeave = useHRStore((state) => state.createLeave);
  const updateLeave = useHRStore((state) => state.updateLeave);
  const deleteLeave = useHRStore((state) => state.deleteLeave);

  useEffect(() => {
    getEmployees();
    getAttendances();
    getContracts();
    getLeaves();
  }, [getEmployees, getAttendances, getContracts, getLeaves]);

  return {
    // State
    employees,
    attendances,
    contracts,
    leaves,
    isLoading,
    error,

    // Employee actions
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,

    // Attendance actions
    getAttendances,
    createAttendance,
    updateAttendance,
    deleteAttendance,

    // Contract actions
    getContracts,
    createContract,
    updateContract,
    deleteContract,

    // Leave actions
    getLeaves,
    createLeave,
    updateLeave,
    deleteLeave,
  };
};

