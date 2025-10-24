interface SignInParams {
  email: string;
  password: string;
}

export const signin = async (data: SignInParams) => {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_BASE_API_URL ||
      "https://online-car-market.onrender.com/api";

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Something went wrong");

    const user = await res.json();
    if (!user.access)
      throw new Error("Error trying to log you in. Please try again.");

    // Store tokens in localStorage instead of cookies
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "auth-tokens",
        JSON.stringify({
          access: user.access,
          refresh: user.refresh,
          user: user.user,
          lastRefreshed: Date.now(),
        })
      );
    }

    return user;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

export const getUser = async (id: number) => {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_BASE_API_URL ||
      "https://online-car-market.onrender.com/api";

    const res = await fetch(`${API_URL}/users/user-profiles/${id}`);
    if (!res.ok) throw new Error("Something went wrong");

    const user = await res.json();
    console.log(user);
    return user;
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    // Return tokens from localStorage instead of cookies
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("auth-tokens");
      if (authData) {
        const parsed = JSON.parse(authData);
        return { access: parsed.access, refresh: parsed.refresh };
      }
    }
    return { access: null, refresh: null };
  } catch (err: any) {
    console.error(err.message);
    throw err;
  }
};
