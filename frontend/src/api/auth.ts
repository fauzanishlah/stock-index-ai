const API_BASE = import.meta.env.VITE_API_URL;
import { showToast } from "@/lib/toast";

const register = async (
  username: string,
  password: string,
  email: string,
  full_name: string,
) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
      full_name,

    })
  });
  if (!response.ok) {
    showToast.error("Failed to register user");
    throw new Error("Failed to register user")
  }
  showToast.success("User registered successfully");
  return response.json();
}

export { register }