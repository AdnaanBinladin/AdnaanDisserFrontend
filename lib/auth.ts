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

// ========================================
// ADMIN API FUNCTIONS
// ========================================

export interface PendingNGO {
  org_id: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  address?: string
  description?: string
  status: string
  created_at: string
}

// Get all pending NGO registrations
export async function getPendingNGOs(): Promise<PendingNGO[]> {
  try {
    const res = await fetch(`${BASE_URL}/admin/ngos/pending`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
      },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.ngos || []);
  } catch (err) {
    console.error("Error fetching pending NGOs:", err);
    throw err;
  }
}

// Approve an NGO registration
export async function approveNGO(ngoId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/admin/ngos/${ngoId}/approve`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
      },
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to approve NGO" };
    }
    return { success: true };
  } catch (err) {
    console.error("Error approving NGO:", err);
    return { success: false, error: "Network error" };
  }
}

// Reject an NGO registration
export async function rejectNGO(ngoId: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/admin/ngos/${ngoId}/reject`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
      },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to reject NGO" };
    }
    return { success: true };
  } catch (err) {
    console.error("Error rejecting NGO:", err);
    return { success: false, error: "Network error" };
  }
}

// Get all users (for admin dashboard)
export async function getAllUsers() {
  try {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching users:", err);
    return { users: [] };
  }
}

// Get admin dashboard stats
export async function getAdminStats() {
  try {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    return null;
  }
}

