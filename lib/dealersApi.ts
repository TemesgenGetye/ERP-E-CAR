import { getCredentials } from "./credential";
import { API_URL } from "./config";
import { Enterprise, DealerAction } from "@/types/Enterprise";

export async function fetchDealers(): Promise<Enterprise[]> {
  try {
    const credential = await getCredentials();
    const res = await fetch(`${API_URL}/dealers/admin/dealers`, {
      headers: {
        Authorization: `Bearer ${credential.access}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.detail ||
        errorData.message ||
        `API error: ${res.status} ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json() as Promise<Enterprise[]>;
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new Error(String(e));
  }
}

export type DealerActionPayload = {
  reason?: string;
};

export type RegisterDealerPayload = {
  email: string;
  password: string;
  company_name: string;
  license_number: string;
  tax_id: string;
  telebirr_account: string;
};

export async function dealerAction(
  id: number,
  action: DealerAction,
  payload?: DealerActionPayload,
): Promise<unknown> {
  try {
    const credential = await getCredentials();
    const body =
      action === "reject" && payload != null
        ? JSON.stringify({ reason: payload.reason ?? "" })
        : undefined;

    const res = await fetch(
      `${API_URL}/dealers/admin/dealers/${id}/${action}/`,
      {
        method: action === "verify" ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${credential.access}`,
          "Content-Type": "application/json",
        },
        ...(body !== undefined && { body }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.detail ||
        errorData.message ||
        `API error: ${res.status} ${res.statusText}`;
      throw new Error(errorMessage);
    }

    return res.json() as Promise<unknown>;
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new Error(String(e));
  }
}

function dealerRegistrationErrorMessage(
  errorData: Record<string, unknown>,
  fallback: string,
): string {
  const nfe = errorData.non_field_errors;
  if (Array.isArray(nfe) && nfe.length > 0 && typeof nfe[0] === "string") {
    return nfe[0];
  }
  const detail = errorData.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    return String(detail[0]);
  }
  if (typeof errorData.message === "string") return errorData.message;
  for (const v of Object.values(errorData)) {
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") {
      return v[0];
    }
    if (typeof v === "string") return v;
  }
  return fallback;
}

/** Public dealer self-registration (no auth). Use from the signup page. */
export async function registerDealerPublic(
  payload: RegisterDealerPayload,
): Promise<unknown> {
  const res = await fetch(`${API_URL}/users/auth/register_dealer/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    throw new Error(
      dealerRegistrationErrorMessage(
        errorData,
        `API error: ${res.status} ${res.statusText}`,
      ),
    );
  }

  return res.json() as Promise<unknown>;
}

/** Authenticated dealer registration (e.g. admin). */
export async function registerDealer(
  payload: RegisterDealerPayload,
): Promise<unknown> {
  try {
    const credential = await getCredentials();
    const res = await fetch(`${API_URL}/users/auth/register_dealer/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${credential.access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = (await res.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;
      throw new Error(
        dealerRegistrationErrorMessage(
          errorData,
          `API error: ${res.status} ${res.statusText}`,
        ),
      );
    }

    return res.json() as Promise<unknown>;
  } catch (e) {
    if (e instanceof Error) throw e;
    throw new Error(String(e));
  }
}
