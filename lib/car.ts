import { getCredentials } from "./credential";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "https://online-car-market.onrender.com/api";

export type CarInspectionPayload = {
  car_id: number;
  inspected_by: string;
  inspection_date: string;
  remarks: string;
  condition_status: "excellent" | "good" | "fair" | "poor";
};

export async function postCarInspection(payload: CarInspectionPayload) {
  const credential = await getCredentials();
  const res = await fetch(`${BASE_URL}/inventory/car-inspections/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credential.access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        errorData.detail ||
        `Failed to submit inspection: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}
