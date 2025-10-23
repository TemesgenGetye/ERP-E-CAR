const API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ||
  "https://online-car-market.onrender.com/api";

type Options = RequestInit & { skipAuth?: boolean };

function decodeToken(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

function isTokenExpiredOrExpiringSoon(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutesFromNow = currentTime + 5 * 60;

  return decoded.exp <= fiveMinutesFromNow;
}

// Helper function to check if refresh token is expired
function isRefreshTokenExpired(refreshToken: string): boolean {
  const decoded = decodeToken(refreshToken);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp <= currentTime;
}

// Helper function to get auth state from localStorage
function getAuthState() {
  try {
    if (typeof window === "undefined") return null;

    const tokenData = localStorage.getItem("auth-tokens");
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      return parsed;
    }
  } catch (error) {
    console.error("Error parsing auth tokens:", error);
  }
  return null;
}

// Helper function to update auth state in localStorage
function updateAuthState(newState: any) {
  try {
    if (typeof window === "undefined") return;

    const currentData = localStorage.getItem("auth-tokens");
    const parsed = currentData ? JSON.parse(currentData) : {};
    const updatedState = { ...parsed, ...newState };
    localStorage.setItem("auth-tokens", JSON.stringify(updatedState));
  } catch (error) {
    console.error("Error updating auth tokens:", error);
  }
}

// Helper function to refresh token via the /api/me endpoint
async function refreshTokens(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  try {
    // Call the /api/me endpoint which handles token refresh server-side
    const response = await fetch("/api/me", {
      method: "GET",
      credentials: "include", // Important: include cookies
    });

    if (response.ok) {
      const data = await response.json();
      if (data.ok && data.user) {
        // The /api/me endpoint refreshes cookies server-side
        // We just need to track that tokens were refreshed
        const now = Date.now();
        updateAuthState({
          lastRefreshed: now,
          user: data.user,
        });
        return { accessToken: "refreshed", refreshToken: "refreshed" };
      }
    }

    // If refresh failed, clear auth state
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-tokens");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-tokens");
    }
  }
  return null;
}

// Check if we need to refresh tokens based on last refresh time
function shouldRefreshTokens(): boolean {
  const authState = getAuthState();
  if (!authState || !authState.lastRefreshed) return false; // Don't refresh if no auth state

  const lastRefreshed = authState.lastRefreshed;
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Refresh if it's been more than 10 minutes since last refresh
  return now - lastRefreshed > tenMinutes;
}

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Helper function to get access token from server
async function getAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/token", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.ok && data.access) {
        return data.access;
      }
    }
  } catch (error) {
    console.error("Failed to get access token:", error);
  }
  return null;
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const { headers, body, skipAuth, ...rest } = opts;

  // Only attempt token refresh if we have auth state and it's not already refreshing
  if (!skipAuth && shouldRefreshTokens() && !isRefreshing) {
    console.log("Token refresh needed, refreshing proactively...");
    isRefreshing = true;
    refreshPromise = refreshTokens();

    try {
      await refreshPromise;
    } catch (error) {
      console.error("Proactive token refresh failed:", error);
      // Clear auth state if refresh fails
      clearAuthState();
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }
  if (isRefreshing && refreshPromise) {
    await refreshPromise;
  }

  const accessToken = skipAuth ? null : await getAccessToken();

  const isFormData = body instanceof FormData;
  let res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers || {}),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    credentials: "include",
    ...rest,
  });
  console.log(headers, "headers", accessToken, "accessToken");

  if (res.status === 401 && !skipAuth) {
    console.log("Got 401, attempting token refresh...");

    // Prevent infinite refresh loops
    if (isRefreshing) {
      console.log("Already refreshing, redirecting to login...");
      if (typeof window !== "undefined") {
        clearAuthState();
        window.location.href = "/signin";
      }
      throw new Error("Authentication failed. Please login again.");
    }

    isRefreshing = true;
    refreshPromise = refreshTokens();

    try {
      const refreshResult = await refreshPromise;

      if (refreshResult) {
        const newAccessToken = await getAccessToken();
        res = await fetch(`${API_URL}${path}`, {
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(newAccessToken
              ? { Authorization: `Bearer ${newAccessToken}` }
              : {}),
            ...(headers || {}),
          },
          body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
          credentials: "include",
          ...rest,
        });
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      if (typeof window !== "undefined") {
        clearAuthState();
        window.location.href = "/signin";
      }
      throw new Error("Authentication failed. Please login again.");
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    let errorMessage = `HTTP ${res.status}`;

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage =
        errorJson.message || errorJson.detail || errorText || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return {} as T;
}

export function initializeAuthState(user?: any) {
  if (typeof window === "undefined") return;

  updateAuthState({
    lastRefreshed: Date.now(),
    user: user || null,
  });
}

export function clearAuthState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth-tokens");
}
