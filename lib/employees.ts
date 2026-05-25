import { API_URL } from "./config";
import { getCredentials } from "./credential";

export interface EmployeeComponent {
  id: number;
  component_name: string;
  amount: string;
}

export interface EmployeeStaffInfo {
  id: number;
  user_email_display: string;
  full_name: string;
  hire_date: string;
  position: string;
  salary: number;
  components: EmployeeComponent[];
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export const getEmployee = async (empId: number): Promise<EmployeeStaffInfo> => {
  const credential = await getCredentials();
  const { access } = credential;
  const response = await fetch(`${API_URL}/hr/employees/${empId}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      errorData?.detail || errorData?.message || "Failed to fetch employee";
    throw new Error(message as string);
  }
  return response.json();
};
