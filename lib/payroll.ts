import { API_URL } from "./config";
import { getCredentials } from "./credential";

export const createSalaryComponent = async (
  name: string,
  component_type: string,
) => {
  const credential = await getCredentials();
  const { access } = credential;
  try {
    const response = await fetch(`${API_URL}/hr/salary-components/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({
        name,
        component_type,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.non_field_errors?.[0] ||
        errorData?.name?.[0] ||
        errorData?.component_type?.[0] ||
        (typeof errorData === "object" && errorData !== null
          ? Object.values(errorData)
              .flat()
              .find((v) => typeof v === "string")
          : null) ||
        "Failed to create salary component";
      throw new Error(errorMessage as string);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getSalaryComponents = async () => {
  try {
    const credential = await getCredentials();
    const { access } = credential;
    const response = await fetch(`${API_URL}/hr/salary-components/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        "Failed to fetch salary components";
      throw new Error(errorMessage as string);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data?.results ?? []);
  } catch (error) {
    throw error;
  }
};

export type EmployeeSalaryAssignment = {
  id: number;
  employee: number;
  component: number;
  amount: string | number;
};

export const getEmployeeSalaries = async (): Promise<
  EmployeeSalaryAssignment[]
> => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/hr/employee-salaries/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      errorData?.error ||
      "Failed to fetch employee salaries";
    throw new Error(errorMessage as string);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : (data?.results ?? []);
};

export const assignSalaryComponent = async (
  employee: number,
  component: number,
  amount: number,
) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/hr/employee-salaries/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      employee,
      component,
      amount,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      errorData?.non_field_errors?.[0] ||
      errorData?.employee?.[0] ||
      errorData?.component?.[0] ||
      errorData?.amount?.[0] ||
      (typeof errorData === "object" && errorData !== null
        ? Object.values(errorData)
            .flat()
            .find((v) => typeof v === "string")
        : null) ||
      "Failed to assign salary component";
    throw new Error(errorMessage as string);
  }
  return response.json();
};

export const createOvertime = async (
  employee: number,
  overtime_type: string,
  hours: number,
  approved: boolean,
  date: string,
) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/hr/overtime`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      employee,
      overtime_type,
      hours,
      approved,
      date,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      errorData?.non_field_errors?.[0] ||
      errorData?.employee?.[0] ||
      errorData?.overtime_type?.[0] ||
      errorData?.hours?.[0] ||
      errorData?.date?.[0] ||
      (typeof errorData === "object" && errorData !== null
        ? Object.values(errorData)
            .flat()
            .find((v) => typeof v === "string")
        : null) ||
      "Failed to create overtime";
    throw new Error(errorMessage as string);
  }
  return response.json();
};

export const postPayrollRun = async (id: number) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/payroll/payroll-runs/${id}/post/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      errorData?.error ||
      "Failed to post payroll run";
    throw new Error(errorMessage as string);
  }
  return response.json();
};

export const approvePayrollRun = async (id: number) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(
    `${API_URL}/payroll/payroll-runs/${id}/approve/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    },
  );
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      errorData?.error ||
      "Failed to approve payroll run";
    throw new Error(errorMessage as string);
  }
  return response.json();
};

export const getPayrollRuns = async () => {
  try {
    const credential = await getCredentials();
    const { access } = credential;
    const response = await fetch(`${API_URL}/payroll/payroll-runs`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        "Failed to fetch payroll runs";
      throw new Error(errorMessage as string);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const createPayrollRun = async (period: string) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/payroll/payroll-runs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      period,
      status: "draft",
    }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      errorData?.non_field_errors?.[0] ||
      errorData?.period?.[0] ||
      (typeof errorData === "object" && errorData !== null
        ? Object.values(errorData)
            .flat()
            .find((v) => typeof v === "string")
        : null) ||
      "Failed to create payroll run";
    throw new Error(errorMessage as string);
  }
  return response.json();
};

export const runPayroll = async (id: number) => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/payroll/payroll-runs/${id}/run/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData?.detail ||
      errorData?.message ||
      errorData?.error ||
      "Failed to run payroll";
    throw new Error(errorMessage as string);
  }
  return response.json();
};

export const getAllPayslips = async () => {
  try {
    const credential = await getCredentials();
    const { access } = credential;
    const response = await fetch(`${API_URL}/payroll/payslips/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        "Failed to fetch payslips";
      throw new Error(errorMessage as string);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data?.results ?? []);
  } catch (error) {
    throw error;
  }
};

export const getPayslip = async () => {
  try {
    const credential = await getCredentials();
    const { access } = credential;
    const response = await fetch(`${API_URL}/payroll/payslips/me/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        "Failed to fetch payslip";
      throw new Error(errorMessage as string);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
