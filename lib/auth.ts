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
  
  export async function loginUser(credentials: LoginData) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  
    const data = await res.json();
  
    if (res.ok && data.donor?.id) {
      localStorage.setItem("donorId", data.donor.id);
      localStorage.setItem("donorEmail", data.donor.email);
      localStorage.setItem("donorName", data.donor.full_name);
      localStorage.setItem("donorRole", data.donor.role);
    }
  
    return data;
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

