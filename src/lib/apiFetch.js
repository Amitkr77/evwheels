import { useAuthStore } from "@/store/authStore";

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (res.status === 401) {
    // Token expired or invalid
    useAuthStore.getState().clearAuth();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw new Error("Session expired");
  }

  return res;
}