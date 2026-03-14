import { UserProfile } from "@/types/Profile";
import { getCredentials } from "./credential";
import { API_URL } from "./config";

export const getProfile = async () => {
  try {
    const credential = await getCredentials();
    const { access, refresh } = credential;

    const res = await fetch(`${API_URL}/users/profiles/me`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        "Something went wrong";
      throw new Error(errorMessage as string);
    }
    const profile: UserProfile = await res.json();
    return profile;
  } catch (err: any) {
    // console.error(err.message);
    throw err;
  }
};

export const upgradeProfile = async (obj: any) => {
  const { data, to } = obj;
  const endpointMap: Record<string, string> = {
    dealer: "upgrade_to_dealer",
    broker: "upgrade_to_broker",
  };

  const endpoint = endpointMap[to];
  try {
    const credential = await getCredentials();
    const { access } = credential;

    const res = await fetch(`${API_URL}/buyers/upgrades/${endpoint}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.non_field_errors?.[0] ||
        (typeof errorData === "object" && errorData !== null
          ? Object.values(errorData).flat().find((v) => typeof v === "string")
          : null) ||
        "Something went wrong";
      throw new Error(errorMessage as string);
    }
    // console.log(res);
    const upgraded = await res.json();
    // console.log("upgraded", upgraded);
    return upgraded;
  } catch (err: any) {
    // console.error(err.message);
    throw err;
  }
};

export const updateProfile = async (data: any) => {
  const credential = await getCredentials();
  const { profile, id } = data;
  try {
    const res = await fetch(`${API_URL}/users/profiles/${id}`, {
      headers: {
        Authorization: `Bearer ${credential.access}`,
      },
      method: "PATCH",
      body: profile,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      // Attempt to extract meaningful error message
      const message =
        errorData?.detail ||
        errorData?.message ||
        (typeof errorData === "object"
          ? Object.values(errorData).flat()[0]
          : null) ||
        "Error updating profile";
      throw new Error(message as string);
    }

    const updatedProfile = await res.json();
    return updatedProfile;
  } catch (err: any) {
    console.error("profile update", err.message);
    throw err;
  }
};

export const getProfileById = async (id: number) => {
  try {
    const credential = await getCredentials();
    const { access } = credential;

    const res = await fetch(`${API_URL}/users/profiles/${id}`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        "Something went wrong";
      throw new Error(errorMessage as string);
    }
    const profile: UserProfile = await res.json();
    return profile;
  } catch (err: any) {
    throw err;
  }
};
