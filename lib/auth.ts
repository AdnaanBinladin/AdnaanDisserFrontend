// api/auth.ts

const BASE_URL = "http://localhost:5050/api";



export interface RegisterUserData {
    full_name: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
  }

  export interface LoginData {
    email: string;
    password: string;
  }
  
  export async function registerUser(userData: RegisterUserData) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return await res.json();
  }
  
/* ============================
   ✅ FIXED LOGIN FUNCTION
============================ */
export async function loginUser(credentials: LoginData) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    // ❌ Login failed (inactive / suspended / wrong creds)
    if (!res.ok) {
      return {
        error: data.error || "Login failed",
        status: res.status,
      };
    }

    // ✅ Login success
    return {
      ...data,
      status: res.status,
    };

  } catch (err) {
    return {
      error: "Unable to reach server",
      status: 500,
    };
  }
}
  
// 🔹 New: Get Donor Profile by ID
export async function getDonorProfile(donorId: string) {
  try {
    const res = await fetch(`${BASE_URL}/donors/${donorId}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching donor profile:", err);
    return null;
  }
}

